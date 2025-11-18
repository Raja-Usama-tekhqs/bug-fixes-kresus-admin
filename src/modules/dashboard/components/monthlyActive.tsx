// eslint-disable-next-line @typescript-eslint/no-explicit-any

import {
  Card,
  DatePicker,
  Dropdown,
  Image,
  message,
  Select,
  Skeleton,
  Tabs,
  TabsProps,
} from "antd";
import { kresusAssets } from "assets";
import dayjs, { Dayjs } from "dayjs";
import useApiClient from "hooks/useApiClient";
import { useEffect, useMemo, useState } from "react";
import base from "../../../assets/allAssets/base.png";
import solanaa from "../../../assets/allAssets/solanaa.png";
import worldchain from "../../../assets/allAssets/worldchain.png";
import AnalyticsHolding from "./analyticsHolding";
import "./index.css";
import TransactionAnalytics from "./transactionAnalytics";
import VolumeAnalytics from "./volumeAnalytics";
const { Option } = Select;
interface VolumeItem {
  chain: string;
  total_volume: string;
  sent_volume: string;
  received_volume: string;
  swapped_volume: string;
}

interface TransactionItem {
  chain: string;
  total_transaction: number;
  sent_transaction: number;
  received_transaction: number;
  swapped_transaction: number;
}

interface ActiveUserResponse {
  monthlyActiveUsers: number;
  weeklyActiveUsers: number;
  dailyActiveUsers: number;
  filteredActiveUsers: number;
}

interface FormState {
  chain?: string;
  address?: string;
  start_date?: string;
  end_date?: string;
}

interface EarnItem {
  token_in?: string;
  token_out?: string;
  count: string;
  total_deposit?: string;
  total_withdraw?: string;
}

interface EarnResponse {
  deposit: EarnItem[];
  withdraw: EarnItem[];
}

const chainOptions = [
  { label: "All chains", value: "" },
  { label: "Solana Mainnet", value: "solana-mainnet" },
  { label: "Base Mainnet", value: "base-mainnet" },
  { label: "WorldChain Mainnet", value: "worldchain-mainnet" },
  { label: "Sui Mainnet", value: "sui-mainnet" },
  { label: "Btc Mainnet", value: "btc-mainnet" },
];

const addressOptions = [
  { label: "Select Your Address", value: "" },
  {
    label: "0x10d543e2e0355e36c5cab769df8d2d60abb77a73",
    value: "0x10d543e2e0355e36c5cab769df8d2d60abb77a73",
  },
  {
    label: "0x20d543e2e0355e36c5cab769df8d2d60abb77a73",
    value: "0x20d543e2e0355e36c5cab769df8d2d60abb77a73",
  },
  {
    label: "0x20d543e2e0355e36c5cab769df8d2d60abb77a74",
    value: "0x20d543e2e0355e36c5cab769df8d2d60abb77a74",
  },
];

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SOL_MINT = "So11111111111111111111111111111111111111112";

const MonthlyActive = () => {
  const [form, setForm] = useState<FormState>({});
  const [volumeData, setVolumeData] = useState<VolumeItem[]>([]);
  const [transactionData, setTransactionData] = useState<TransactionItem[]>([]);
  const [earnData, setEarnData] = useState<EarnResponse>({
    deposit: [],
    withdraw: [],
  });
  const [activeTab, setActiveTab] = useState<string>("active");

  const [activeUserStats, setActiveUserStats] =
    useState<ActiveUserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getRequest } = useApiClient();

  const handleChange = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateDates = (
    startDate: string | undefined,
    endDate: string | undefined
  ): boolean => {
    if (!startDate || !endDate) return true;
    return dayjs(endDate).isAfter(dayjs(startDate));
  };

  const handleDateChange = (
    name: "start_date" | "end_date",
    date: Dayjs | null
  ) => {
    const newDate = date ? date.format("YYYY-MM-DD") : undefined;

    const otherDate = name === "start_date" ? form.end_date : form.start_date;

    if (newDate && otherDate) {
      if (name === "end_date" && !validateDates(otherDate, newDate)) {
        return;
      } else if (name === "start_date" && !validateDates(newDate, otherDate)) {
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: newDate,
    }));
  };

  const fetchAllData = async () => {
    setLoading(true);
    const { start_date, end_date } = form;
    const commonParams = Object.fromEntries(
      Object.entries({ ...form }).filter(([_, val]) => val?.trim() !== "")
    );
    const dateOnlyParams = { start_date, end_date };
    const vaultURL = import.meta.env.VITE_REACT_APPLICATION_VAULT_URL;
    try {
      const [volumeRes, transactionRes, earnRes, activeRes] = await Promise.all(
        [
          getRequest<{ volume: VolumeItem[] }>(
            `${vaultURL}analytics/volume`,
            commonParams
          ),
          getRequest<{ transaction: TransactionItem[] }>(
            `${vaultURL}analytics/transaction`,
            commonParams
          ),
          getRequest<EarnResponse>(`${vaultURL}analytics/earn`, dateOnlyParams),
          getRequest<ActiveUserResponse>(
            `${vaultURL}analytics/monthly-active`,
            dateOnlyParams
          ),
        ]
      );

      setVolumeData(volumeRes.volume || []);
      setTransactionData(transactionRes.transaction || []);
      setEarnData(earnRes || { deposit: [], withdraw: [] });
      setActiveUserStats(activeRes || null);
      // message.success("Analytics data loaded successfully");
    } catch (err) {
      console.error("Error fetching analytics data", err);
      message.error("Error fetching analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchAllData, 500);
    return () => clearTimeout(debounce);
  }, [form]);

  const earnMetrics = useMemo(() => {
    const usdcDeposit = earnData.deposit.find((e) => e.token_in === USDC_MINT);
    const solDeposit = earnData.deposit.find((e) => e.token_in === SOL_MINT);
    const usdcWithdraw = earnData.withdraw.find(
      (e) => e.token_out === USDC_MINT
    );
    const solWithdraw = earnData.withdraw.find((e) => e.token_out === SOL_MINT);

    return {
      usdcDepositAmount: usdcDeposit
        ? parseFloat(usdcDeposit.total_deposit!)
        : 0,
      solDepositAmount: solDeposit ? parseFloat(solDeposit.total_deposit!) : 0,
      usdcDepositCount: usdcDeposit ? parseInt(usdcDeposit.count) : 0,
      solDepositCount: solDeposit ? parseInt(solDeposit.count) : 0,
      usdcWithdrawAmount: usdcWithdraw
        ? parseFloat(usdcWithdraw.total_withdraw!)
        : 0,
      solWithdrawAmount: solWithdraw
        ? parseFloat(solWithdraw.total_withdraw!)
        : 0,
      usdcWithdrawCount: usdcWithdraw ? parseInt(usdcWithdraw.count) : 0,
      solWithdrawCount: solWithdraw ? parseInt(solWithdraw.count) : 0,
      totalUsdcVolume:
        (usdcDeposit ? parseFloat(usdcDeposit.total_deposit!) : 0) +
        (usdcWithdraw ? parseFloat(usdcWithdraw.total_withdraw!) : 0),
      totalSolVolume:
        (solDeposit ? parseFloat(solDeposit.total_deposit!) : 0) +
        (solWithdraw ? parseFloat(solWithdraw.total_withdraw!) : 0),
      totalUsdcTransactions:
        (usdcDeposit ? parseInt(usdcDeposit.count) : 0) +
        (usdcWithdraw ? parseInt(usdcWithdraw.count) : 0),
      totalSolTransactions:
        (solDeposit ? parseInt(solDeposit.count) : 0) +
        (solWithdraw ? parseInt(solWithdraw.count) : 0),
    };
  }, [earnData]);

  const renderChainTitle = (chain: string) =>
    chain
      .replace("-mainnet", "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const renderChainIcon = (chain: string) => {
    switch (chain) {
      case "solana-mainnet":
        return (
          <Image
            src={solanaa}
            alt="Solana"
            width={35}
            height={40}
            preview={false}
          />
        );
      case "base-mainnet":
        return (
          <Image src={base} alt="Base" width={45} height={40} preview={false} />
        );
      case "worldchain-mainnet":
        return (
          <Image
            src={worldchain}
            width={45}
            height={40}
            alt="WorldChain"
            preview={false}
          />
        );
      default:
        return <span className="text-xl sm:text-2xl">🔗</span>;
    }
  };

  const renderMetric = (label: string, value: number | string) => {
    const icons: Record<string, string> = {
      "Total Volume (USD)": "📊",
      "Sent Volume (USD)": "📤",
      "Received Volume (USD)": "📥",
      "Swapped Volume (USD)": "🔄",
      "Dapp Volume (USD)": "🔄",
      "Dapp Transaction": "📈",
      "Total Transactions": "📈",
      Sent: "📤",
      Received: "📥",
      Swapped: "🔄",
      "USDC Deposit (Token Value)": "💵",
      "SOL Deposit (Token Value)": "💎",
      "USDC Withdraw (Token Value)": "💸",
      "SOL Withdraw (Token Value)": "💎",
      "USDC Deposit Count": "💵",
      "SOL Deposit Count": "💎",
      "USDC Withdraw Count": "💸",
      "SOL Withdraw Count": "💎",
    };

    const icon = icons[label] || "📌";

    return (
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-1 p-2 sm:p-3 hover:bg-blue-600 hover:text-blue-600 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] border border-gray-100 hover:border-blue-200">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-medium">
          <span className="text-lg sm:text-xl transform transition-transform duration-300 hover:scale-110 text-white">
            {icon}
          </span>
          <span className="hover:text-blue-600 transition-colors duration-300 text-white">
            {label}
          </span>
        </div>
        <div className="text-sm sm:text-base lg:text-lg font-semibold  break-words text-white hover:text-blue-600 text-right sm:text-left bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
          {typeof value === "number"
            ? value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
        </div>
      </div>
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "active",
      label: "Holding Analytics",
      children: <AnalyticsHolding />,
    },
    {
      key: "volume",
      label: "Volume Analytics",
      children: (
        <VolumeAnalytics
          volumeData={volumeData}
          earnMetrics={earnMetrics}
          loading={loading}
        />
      ),
    },
    {
      key: "transaction",
      label: "Transactions Analytics",
      children: (
        <TransactionAnalytics
          transactionData={transactionData}
          earnMetrics={earnMetrics}
          loading={loading}
        />
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const renderActiveUserCard = () => (
    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 bg-[#161616] p-2 sm:p-4 md:p-[24px] rounded-[24px] border-dashboard-top">
      <Card style={{ background: "transparent", border: "none" }}>
        {loading || !activeUserStats ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 p-2 sm:p-4 text-white">
            {[
              {
                label: "Monthly Active",
                icon: kresusAssets.calendar,
                value: activeUserStats.monthlyActiveUsers,
              },
              {
                label: "Weekly Active",
                icon: kresusAssets.weeklyActiveCalendar,
                value: activeUserStats.weeklyActiveUsers,
              },
              {
                label: "Daily Active",
                icon: kresusAssets.dailyActiveIcon,
                value: activeUserStats.dailyActiveUsers,
              },
              {
                label: "Filtered Users",
                icon: kresusAssets.filteredUserIcon,
                value: activeUserStats.filteredActiveUsers,
              },
            ].map((metric, index) =>
              index === 0 ? (
                // Monthly Active (wider card)
                <div
                  key={metric?.label}
                  className="bg-[linear-gradient(314.39deg,#0734A9_0%,#0E1696_53.42%,#4B0792_98.92%)]
             rounded-[12px] sm:rounded-[16px]
             p-4 sm:p-6 md:px-8 md:py-6 lg:px-[64px] lg:py-[32px]
             flex-1 flex items-center
             w-1/2 lg:w-auto" // ✅ added this
                >
                  {" "}
                  <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-4 flex-col sm:flex-row">
                    <div className="w-6 h-6 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px]">
                      <img
                        src={metric.icon}
                        className="w-full h-full"
                        alt={metric.label}
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-3 md:gap-3 items-center">
                      <div>
                        <span className="font-roboto font-semibold text-[16px] sm:text-3xl md:text-4xl lg:text-[56px] leading-[100%] tracking-[0%] ">
                          {metric?.value?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-roboto font-normal text-[12px] sm:text-base md:text-lg lg:text-[20px] leading-[100%] tracking-[0%] text-[#AEAEB2]">
                          {metric?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Remaining cards
                <div
                  key={metric?.label}
                  className="bg-[#000000] rounded-[12px] sm:rounded-[16px]
             p-4 sm:p-6 md:px-4 lg:px-[16px] py-4 sm:py-6 md:py-[32px]
             flex flex-col items-center gap-2 sm:gap-3
             flex-1
             w-1/2 lg:w-auto" // ✅ added this
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transform transition-transform duration-300 hover:scale-110 text-white flex justify-center items-center">
                    <img
                      src={metric.icon}
                      alt={metric.label}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="font-roboto font-bold text-[16px] sm:text-2xl md:text-3xl lg:text-[32px] leading-[100%] tracking-[0%] text-center text-[#FFFFFF]">
                    {metric?.value?.toLocaleString()}
                  </div>
                  <div className="font-roboto font-normal text-[12px] sm:text-sm md:text-base lg:text-[16px] leading-[100%] tracking-[0%] text-center text-[#8E8E93]">
                    {metric?.label}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col gap-6 sm:gap-8 overflow-x-hidden mt-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-10 px-4 sm:px-6 md:px-8 lg:px-[120px] dashboard-analytics-filters">
        <span className="font-roboto font-medium text-2xl sm:text-3xl lg:text-[32px] leading-[100%] tracking-[0%] text-center lg:text-left text-[#FFFFFF] w-full lg:w-auto">
          Dashboard Analytics
        </span>

        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          dropdownRender={() => (
            <div className="bg-[#0C0C0E] text-white  lg:w-[325px] p-4 sm:px-[24px] sm:py-[32px] rounded-[20px] flex flex-col gap-4 border border-[#1A26E7] shadow-[0_0_25px_rgba(26,38,231,0.2)] custom-select-wrapper">
              {/* Header */}
              <div className="flex items-center gap-2 pb-3 border-b border-[#2C2C2E]">
                <img
                  src={kresusAssets?.tokenDropdownIcon}
                  alt="Filters Icon"
                  className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-[#FFFFFF]"
                />
                <span className="font-roboto font-semibold text-lg sm:text-[20px] leading-[100%]">
                  Filters
                </span>
              </div>

              {/* Select Chain */}
              <div className="flex flex-col gap-1 custom-select-wrapper">
                <Select
                  value={form.chain}
                  onChange={(val) =>
                    handleChange("chain", Array.isArray(val) ? val[0] : val)
                  }
                  placeholder="Select Chain"
                  className="custom-placeholder !bg-[#1C1C1E] !text-[#C7C7CC] !border-none rounded-lg h-[44px] sm:h-[50px] hover:!bg-[#2C2C2E] transition-all text-sm sm:text-base"
                  popupClassName="filter-select-popup !bg-[#1C1C1E] !text-white !border-none"
                  suffixIcon={
                    <img
                      src={kresusAssets?.filterDownArrow}
                      alt=""
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  }
                >
                  {chainOptions?.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      <span className="text-[#C7C7CC] text-sm sm:text-base">
                        {opt.label}
                      </span>
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Select Address */}
              <div className="flex flex-col gap-1 custom-select-wrapper">
                <Select
                  value={form.address}
                  onChange={(val) =>
                    handleChange("address", Array.isArray(val) ? val[0] : val)
                  }
                  placeholder="Select Address"
                  className="custom-placeholder !bg-[#1C1C1E] !text-[#C7C7CC] !border-none rounded-lg h-[44px] sm:h-[48px] hover:!bg-[#2C2C2E] transition-all text-sm sm:text-base"
                  popupClassName="filter-select-popup !bg-[#1C1C1E] !text-white !border-none"
                  suffixIcon={
                    <img
                      src={kresusAssets?.filterDownArrow}
                      alt=""
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  }
                >
                  {addressOptions?.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      <span className="text-[#C7C7CC] text-sm sm:text-base">
                        {opt.label}
                      </span>
                    </Option>
                  ))}
                </Select>
              </div>
              {/* <div className="flex flex-col gap-1 custom-select-wrapper">
                <input
                  type="text"
                  value={form.address || ""}
                  onChange={(e) =>
                    handleChange("address", e.target.value.trim())
                  }
                  placeholder="Enter Address"
                  className=" bg-[#1C1C1E] text-[#C7C7CC] border-none rounded-lg h-[44px] sm:h-[48px] px-3 hover:bg-[#2C2C2E] transition-all text-sm sm:text-base outline-none placeholder-[#C7C7CC]"
                />
              </div> */}

              {/* Start Date */}
              <div className="flex flex-col gap-1">
                <DatePicker
                  value={form.start_date ? dayjs(form.start_date) : null}
                  onChange={(d) => handleDateChange("start_date", d)}
                  format="YYYY-MM-DD"
                  className="w-full !bg-[#1C1C1E] !text-[#C7C7CC] !border-none rounded-lg h-[44px] sm:h-[48px] px-3 hover:!bg-[#2C2C2E] custom-datepicker text-sm sm:text-base"
                  suffixIcon={
                    <img
                      src={kresusAssets?.filterDateCalendar}
                      alt=""
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  }
                  placeholder="Select Start Date"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1">
                <DatePicker
                  value={form.end_date ? dayjs(form.end_date) : null}
                  onChange={(d) => handleDateChange("end_date", d)}
                  format="YYYY-MM-DD"
                  className="w-full !bg-[#1C1C1E] !text-[#C7C7CC] !border-none rounded-lg h-[44px] sm:h-[48px] px-3 hover:!bg-[#2C2C2E] custom-datepicker text-sm sm:text-base"
                  suffixIcon={
                    <img
                      src={kresusAssets?.filterDateCalendar}
                      alt=""
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  }
                  placeholder="Select End Date"
                />
              </div>
            </div>
          )}
        >
          <div className="rounded-[20px] sm:rounded-[24px] py-2 sm:py-[12px] px-3 sm:px-[24px] bg-[#FFFFFF] cursor-pointer hover:bg-[#F3F3F3] transition-all sm:w-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-[8px]">
              <img
                src={kresusAssets.filterAnalyticsIcon}
                alt=""
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <span className="font-roboto font-medium text-sm sm:text-[16px] text-[#000] whitespace-nowrap ">
                Filter Analytics
              </span>
            </div>
          </div>
        </Dropdown>
      </div>

      {/* <div className=" rounded-xl text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 sm:p-6 mb-6 sm:mb-8 border-2 !border-white transition-all duration-300 ease-in-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-2 !border-white">
          <div className="space-y-2">
            <div className="w-full">
              <label className="block mb-1 font-bold text-xs sm:text-sm">
                Select Chain
              </label>
              <Select
                value={form.chain}
                onChange={(val) =>
                  handleChange("chain", Array.isArray(val) ? val[0] : val)
                }
                placeholder="Select chain"
                className="custom-select w-full"
                size="large"
                dropdownClassName="custom-select-dropdown"
              >
                {chainOptions?.map((opt) => (
                  <Option
                    key={opt.value}
                    value={opt.value}
                    className="custom-select-option"
                  >
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full">
              <label className="block mb-1 font-bold text-xs sm:text-sm">
                Select Address
              </label>
              <Select
                value={form.address}
                onChange={(val) =>
                  handleChange("address", Array.isArray(val) ? val[0] : val)
                }
                placeholder="Select Address"
                className="custom-select w-full"
                size="large"
                dropdownClassName="custom-select-dropdown"
              >
                {addressOptions?.map((opt) => (
                  <Option
                    key={opt.value}
                    value={opt.value}
                    className="custom-select-option"
                  >
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="w-full">
            <label className="block mb-1 font-bold text-xs sm:text-sm">
              Start Date
            </label>
            <div className="custom-select-input">
              <DatePicker
                value={form.start_date ? dayjs(form.start_date) : null}
                onChange={(d) => handleDateChange("start_date", d)}
                format="YYYY-MM-DD"
                className={classNames("w-full", {
                  "border-red-500": dateError,
                })}
                size="large"
                status={dateError ? "error" : undefined}
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block mb-1 font-bold text-xs sm:text-sm">
              End Date
            </label>
            <div className="custom-select-input">
              <DatePicker
                value={form.end_date ? dayjs(form.end_date) : null}
                onChange={(d) => handleDateChange("end_date", d)}
                format="YYYY-MM-DD"
                className={classNames("w-full", {
                  "border-red-500": dateError,
                })}
                size="large"
                status={dateError ? "error" : undefined}
              />
              {dateError && (
                <div className="text-red-500 text-xs mt-1">{dateError}</div>
              )}
            </div>
          </div>
        </div>
      </div> */}

      <div className=" px-[10px] sm:px-[20px] md:px-[120px]">
        {renderActiveUserCard()}
      </div>
      {/* Tabs */}

      <div className="px-3 sm:px-4 md:px-6 mt-2 lg:px-[120px]">
        <Tabs
          defaultActiveKey="active"
          items={items}
          className="custom-tabss"
          size="large"
          onChange={handleTabChange}
          tabBarStyle={{
            background: "#000000",
            borderRadius: "40px",
            marginBottom: "",
            marginLeft: "100px",
            marginRight: "100px",
          }}
          tabBarGutter={8}
        />
      </div>
      {/* 
     {renderCardSection(
        "Volume Analytics",
        augmentedVolumeData,
        [
          ["Total Volume (USD)", "total_volume"],
          ["Sent Volume (USD)", "sent_volume"],
          ["Received Volume (USD)", "received_volume"],
          ["Swapped Volume (USD)", "swapped_volume"],
          ["Dapp Volume (USD)", "dapp_volume"],
        ],
        {
          "solana-mainnet": [
            ["USDC Deposit (Token Value)", "usdcDepositAmount"],
            ["SOL Deposit (Token Value)", "solDepositAmount"],
            ["USDC Withdraw (Token Value)", "usdcWithdrawAmount"],
            ["SOL Withdraw (Token Value)", "solWithdrawAmount"],
            ["Dapp Volume (USD)", "dapp_volume"],
          ],
        },
        true
      )}  */}

      {/* {renderCardSection(
        "Transaction Analytics",
        augmentedTransactionData,
        [
          ["Total Transactions", "total_transaction"],
          ["Sent", "sent_transaction"],
          ["Received", "received_transaction"],
          ["Swapped", "swapped_transaction"],
          ["Dapp Transaction", "dapp_transaction"],
        ],
        {
          "solana-mainnet": [
            ["USDC Deposit Count", "usdcDepositCount"],
            ["SOL Deposit Count", "solDepositCount"],
            ["USDC Withdraw Count", "usdcWithdrawCount"],
            ["SOL Withdraw Count", "solWithdrawCount"],
            ["Dapp Transaction", "dapp_transaction"],
          ],
        }
      )} */}
    </div>
  );
};

export default MonthlyActive;
