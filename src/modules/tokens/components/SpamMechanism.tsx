import type { TableProps } from "antd";
import { Button, Dropdown, message, Spin, Table, Modal } from "antd";
import classNames from "classnames";
import useApiClient from "hooks/useApiClient";
import React, { useEffect, useMemo, useState } from "react";
import CustomSearch from "../../../components/CustomSearch/CustomSearch";
import "./styles.css";
import { kresusAssets } from "assets";

interface Token {
  id: number;
  token_address: string;
  name: string;
  chain: string;
  score: string;
  data: string;
  moved_by: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiError {
  message: string;
  details?: { message: string }[];
}

interface SpamMechanismProps {
  activeTab: string;
}

const chainOptions = [
  { label: "Solana Mainnet", value: "solana-mainnet" },
  { label: "Base Mainnet", value: "base-mainnet" },
  { label: "WorldChain Mainnet", value: "worldchain-mainnet" },
  { label: "Sui Mainnet", value: "sui-mainnet" },
];

const scoreRangeOptions = [
  { label: "Below 50", value: "below-50" },
  { label: "Between 50 and 60", value: "50-60" },
  { label: "Between 60 and 70", value: "60-70" },
  { label: "Between 70 and 80", value: "70-80" },
  { label: "Between 80 and 90", value: "80-90" },
  { label: "Between 90 and 100", value: "90-100" },
];

const sortOptions = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const SpamMechanism: React.FC<SpamMechanismProps> = ({ activeTab }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>(
    {}
  );
  console.log(setDeleteLoading);
  const [moveLoading, setMoveLoading] = useState<Record<string, boolean>>({});
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [scoreRange, setScoreRange] = useState<string>("");
  const [scoreSort, setScoreSort] = useState<string>("");
  console.log(setScoreSort, "setScoreSort");
  const [dateSort, setDateSort] = useState<string>("");
  const [error, setError] = useState<string | ApiError | null>(null);

  // Modal states
  const [isMoveModalVisible, setIsMoveModalVisible] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  console.log(error, "error");
  const { getRequest, patchRequest } = useApiClient();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchTokens = async () => {
    console.log("fetchTokens called with:", {
      activeTab,
      selectedChain,
      scoreSort,
      dateSort,
    });

    setLoading(true);
    setError(null);
    try {
      const vaultURL = import.meta.env
        .VITE_REACT_APPLICATION_VAULT_URL as string;

      // Build query parameters
      const params = new URLSearchParams();

      // Only add chain parameter if a chain is selected
      if (selectedChain) {
        params.append("chain", selectedChain);
      }

      if (scoreSort) {
        params.append("order_by", scoreSort);
      }

      if (dateSort) {
        params.append("order_by_date", dateSort);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${vaultURL}spam-tokens/mechanism?${queryString}`
        : `${vaultURL}spam-tokens/mechanism`;

      console.log("Making API call to:", url);
      const response = await getRequest<Token[]>(url, {});
      console.log("API response:", response);
      setTokens(response || []);
      setPagination((prev) => ({ ...prev, total: response?.length || 0 }));
    } catch (err: any) {
      let msg: string | ApiError = "Failed to fetch spam tokens";
      if (err?.response?.data) {
        msg = err.response.data;
      } else if (err?.message) {
        msg = err.message;
      } else if (typeof err === "string") {
        msg = err;
      }
      setError(msg);
      setTokens([]);
      if (typeof msg === "string") {
        message.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "spam-mechanism") {
      fetchTokens();
    }
  }, [activeTab, selectedChain, scoreSort, dateSort]);

  const handleMove = async (tokenAddress: string, chain: string) => {
    const key = `${tokenAddress}-${chain}`;
    setMoveLoading((prev) => ({ ...prev, [key]: true }));
    setError(null);

    try {
      const vaultURL = import.meta.env
        .VITE_REACT_APPLICATION_VAULT_URL as string;
      const payload = {
        token_address: tokenAddress,
        chain: chain,
      };

      // Empty object response type since that's what we get on success
      await patchRequest<Record<string, never>>(
        `${vaultURL}spam-tokens/move`,
        payload
      );

      message.success("Token moved successfully");
      // Refresh the list after moving
      await fetchTokens();
    } catch (err: any) {
      let msg: string | ApiError = "Failed to move token";
      if (err?.response?.data) {
        msg = err.response.data;
      } else if (err?.message) {
        msg = err.message;
      } else if (typeof err === "string") {
        msg = err;
      }
      setError(msg);
      if (typeof msg === "string") {
        message.error(msg);
      }
    } finally {
      setMoveLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // 👇 CUSTOM MODAL: Move confirmation
  const showMoveConfirm = (token: Token): void => {
    setSelectedToken(token);
    setIsMoveModalVisible(true);
  };

  const handleMoveConfirm = (): void => {
    if (selectedToken) {
      handleMove(selectedToken.token_address, selectedToken.chain);
    }
    setIsMoveModalVisible(false);
    setSelectedToken(null);
  };

  const handleMoveModalCancel = (): void => {
    setIsMoveModalVisible(false);
    setSelectedToken(null);
  };

  const filteredTokens = useMemo(() => {
    let filtered = tokens;

    // Filter by score range (frontend filtering)
    if (scoreRange) {
      filtered = filtered.filter((token) => {
        const score = Number(token.score);
        switch (scoreRange) {
          case "below-50":
            return score < 50;
          case "50-60":
            return score >= 50 && score < 60;
          case "60-70":
            return score >= 60 && score < 70;
          case "70-80":
            return score >= 70 && score < 80;
          case "80-90":
            return score >= 80 && score < 90;
          case "90-100":
            return score >= 90 && score <= 100;
          default:
            return true;
        }
      });
    }

    // Filter by search text
    if (searchText.trim()) {
      const searchTerms = searchText.toLowerCase().trim().split(/\s+/);
      filtered = filtered.filter((token) => {
        const searchableText = [
          token.name?.toLowerCase() || "",
          token.token_address.toLowerCase(),
          token.chain.toLowerCase(),
        ].join(" ");

        return searchTerms.every((term) => searchableText.includes(term));
      });
    }

    return filtered;
  }, [tokens, searchText, scoreRange]);

  const paginatedTokens = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredTokens.slice(start, end);
  }, [filteredTokens, pagination.current, pagination.pageSize]);

  const columns: TableProps<Token>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <span className="font-mono text-sm">{id}</span>,

      // render: (_: any, __: any, index: number) => index + 1,
      sorter: (a, b) => a.id - b.id,
      width: 80,
    },
    {
      title: "Token Address",
      dataIndex: "token_address",
      key: "token_address",
      render: (address) => <span className="font-mono text-sm">{address}</span>,
      sorter: (a, b) => a.token_address.localeCompare(b.token_address),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name || "N/A",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Chain",
      dataIndex: "chain",
      key: "chain",
      render: (chain) =>
        chain
          .replace("-mainnet", "")
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      sorter: (a, b) => a.chain.localeCompare(b.chain),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score: string) => (
        <span
          className={`px-3 py-1 rounded-full text-[14px] font-normal flex items-center gap-2 ${
            Number(score) <= 49 ? "text-[#34C759]" : " text-[#BA2130]"
          }`}
        >
          <img
            src={
              Number(score) <= 49
                ? kresusAssets.scoreIconTop
                : kresusAssets.scoreIcondown
            }
            alt="score icon"
          />
          {score}
        </span>
      ),

      sorter: (a, b) => Number(a.score) - Number(b.score),
      width: 100,
    },
    // add here create a column for created at from response and show it in localtime
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (createdAt) => (
        <span className="font-mono text-sm">
          {new Date(createdAt).toLocaleString()}
        </span>
      ),
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => {
        const key = `${record.token_address}-${record.chain}`;
        const isDeleteLoading = deleteLoading[key] || false;
        const isMoveLoading = moveLoading[key] || false;
        const isAnyLoading = isDeleteLoading || isMoveLoading;

        return (
          <div className="flex flex-row gap-2 justify-center">
            <Button
              type="text"
              icon={<img src={kresusAssets.actionMoveIcon} alt="Move" />}
              size="small"
              className="flex items-center justify-center p-0 hover:opacity-80"
              loading={isMoveLoading}
              disabled={isAnyLoading}
              onClick={() => showMoveConfirm(record)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen  ">
      <div className="mb-4 sm:mb-6  border ">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
          {/* left side - Filters and Search */}

          {/* Custom Search */}
          <div className="flex  gap-2 w-full lg:w-auto">
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <div
                  className=" mt-3 bg-black text-white w-[325px] p-[24px] rounded-[16px] flex flex-col gap-2 s-mac-border 
  [box-shadow:-12px_12px_37px_0px_#4C377B1A,_-47px_47px_67px_0px_#4C377B17,_-106px_106px_90px_0px_#4C377B0D,_-188px_189px_107px_0px_#4C377B03,_-294px_295px_117px_0px_#4C377B00]"
                >
                  <div className="flex items-center gap-2 px-2 pb-2 border-b border-[#2C2C2E]">
                    <img
                      src={kresusAssets?.tokenDropdownIcon}
                      alt=""
                      className="w-6 h-6 text-[#AEAEB2]"
                    />
                    <span className="font-roboto font-semibold leading-[100%] tracking-[0] text-[#AEAEB2] text-[16px]">
                      Filter By
                    </span>
                  </div>
                  {/* Chain Section */}
                  <Dropdown
                    trigger={["hover"]}
                    placement="bottom"
                    dropdownRender={() => (
                      <div className="rounded-[6px] [box-shadow:-12px_12px_37px_0px_#4C377B1A,_-47px_47px_67px_0px_#4C377B17,_-106px_106px_90px_0px_#4C377B0D,_-188px_189px_107px_0px_#4C377B03,_-294px_295px_117px_0px_#4C377B00]">
                        {chainOptions.map((option, idx) => (
                          <>
                            <div className="h-[1px] bg-[#5e5e61]" />

                            <div
                              key={option.value}
                              onClick={() => {
                                setSelectedChain(option.value);
                                setPagination((prev) => ({
                                  ...prev,
                                  current: 1,
                                }));
                              }}
                              className={`py-[16px] px-[48px] border-b-2 border-gray-300 cursor-pointer
                                ${
                                  selectedChain === option.value
                                    ? "bg-[#5f5f64] !text-black" // ✅ light gray when selected
                                    : "bg-[#3A3A3C] hover:bg-[#2C2C2E]"
                                }`}
                            >
                              <span className="text-[#C7C7CC] font-roboto font-normal text-[14px] leading-[100%] tracking-[0]">
                                {option.label}
                              </span>
                            </div>

                            {idx === chainOptions.length - 1 && (
                              <div className="h-[1px] bg-[#5e5e61]" />
                            )}
                          </>
                        ))}
                      </div>
                    )}
                  >
                    <div className="bg-black p-[16px] flex items-center justify-between cursor-pointer">
                      <div className="px-[18px] flex items-center gap-[8px]">
                        <img src={kresusAssets.chainIcon} alt="" />
                        <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0%] text-[#C7C7CC]">
                          Chain
                        </span>
                      </div>
                      <div>
                        <img src={kresusAssets.iconDownward} alt="" />
                      </div>
                    </div>
                  </Dropdown>

                  {/* Sort Score Section */}
                  <Dropdown
                    trigger={["hover"]}
                    placement="bottom"
                    dropdownRender={() => (
                      <div className="rounded-[6px] [box-shadow:-12px_12px_37px_0px_#4C377B1A,_-47px_47px_67px_0px_#4C377B17,_-106px_106px_90px_0px_#4C377B0D,_-188px_189px_107px_0px_#4C377B03,_-294px_295px_117px_0px_#4C377B00]">
                        {sortOptions.map((option, idx) => (
                          <>
                            <div className="h-[1px] bg-[#5e5e61]" />
                            <div
                              key={option.value}
                              className={`py-[16px] px-[48px] border-b-2 border-gray-300 cursor-pointer 
                                ${
                                  dateSort === option.value
                                    ? "bg-[#5f5f64]" // ✅ selected item color
                                    : "bg-[#3A3A3C] hover:bg-[#2C2C2E]"
                                }`}
                              onClick={
                                option.value === "asc"
                                  ? () => {
                                      setDateSort("asc");
                                      setPagination((prev) => ({
                                        ...prev,
                                        current: 1,
                                      }));
                                    }
                                  : () => {
                                      setDateSort("desc");
                                      setPagination((prev) => ({
                                        ...prev,
                                        current: 1,
                                      }));
                                    }
                              }
                            >
                              <span className="text-[#C7C7CC] font-roboto font-normal text-[14px]">
                                {option.label}
                              </span>
                            </div>

                            {idx === sortOptions.length - 1 && (
                              <div className="h-[1px] bg-[#5e5e61]" />
                            )}
                          </>
                        ))}
                      </div>
                    )}
                  >
                    <div className="bg-black p-[16px] flex items-center justify-between rounded-[6px] cursor-pointer">
                      <div className="px-[18px] flex items-center gap-[8px]">
                        <img src={kresusAssets.chainIcon} alt="" />
                        <span className="font-roboto font-medium text-[14px] text-[#C7C7CC]">
                          Sort Score
                        </span>
                      </div>
                      <img src={kresusAssets.iconDownward} alt="" />
                    </div>
                  </Dropdown>

                  {/* Sort Date Range Section */}
                  <Dropdown
                    trigger={["hover"]}
                    placement="bottom"
                    dropdownRender={() => (
                      <div className="rounded-[6px] [box-shadow:-12px_12px_37px_0px_#4C377B1A,_-47px_47px_67px_0px_#4C377B17,_-106px_106px_90px_0px_#4C377B0D,_-188px_189px_107px_0px_#4C377B03,_-294px_295px_117px_0px_#4C377B00]">
                        {sortOptions.map((option, idx) => (
                          <React.Fragment key={option.value}>
                            <div className="h-[1px] bg-[#5e5e61]" />
                            <div
                              onClick={() => {
                                setDateSort(option.value);
                                setPagination((prev) => ({
                                  ...prev,
                                  current: 1,
                                }));
                              }}
                              className={`py-[16px] px-[48px] border-b-2 border-gray-300 cursor-pointer transition-all 
                                  ${
                                    dateSort === option.value
                                      ? "bg-[#5f5f64]" // ✅ selected item color
                                      : "bg-[#3A3A3C] hover:bg-[#2C2C2E]"
                                  }`}
                            >
                              <span className="text-[#C7C7CC] font-roboto font-normal text-[14px] leading-[100%]">
                                {option.label}
                              </span>
                            </div>
                            {idx === sortOptions.length - 1 && (
                              <div className="h-[1px] bg-[#5e5e61]" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  >
                    <div className="bg-black p-[16px] flex items-center justify-between rounded-[6px] cursor-pointer">
                      <div className="px-[18px] flex items-center gap-[8px]">
                        <img src={kresusAssets.chainIcon} alt="" />
                        <span className="font-roboto font-medium text-[14px] text-[#C7C7CC]">
                          Sort Date Range
                        </span>
                      </div>
                      <img src={kresusAssets.iconDownward} alt="" />
                    </div>
                  </Dropdown>

                  {/* Range Section */}
                  <Dropdown
                    trigger={["hover"]}
                    placement="bottom"
                    dropdownRender={() => (
                      <div className="rounded-[6px] [box-shadow:-12px_12px_37px_0px_#4C377B1A,_-47px_47px_67px_0px_#4C377B17,_-106px_106px_90px_0px_#4C377B0D,_-188px_189px_107px_0px_#4C377B03,_-294px_295px_117px_0px_#4C377B00]">
                        {scoreRangeOptions.map((option, idx) => (
                          <>
                            <div className="h-[1px] bg-[#5e5e61]" />
                            <div
                              key={option.value}
                              onClick={() => setScoreRange(option.value)}
                              className={`py-[16px] px-[48px] border-b-2 border-gray-300 cursor-pointer 
              ${
                scoreRange === option.value
                  ? "bg-[#5f5f64]" // ✅ selected item color
                  : "bg-[#3A3A3C] hover:bg-[#2C2C2E]"
              }`}
                            >
                              <span className="text-[#C7C7CC] font-roboto font-normal text-[14px]">
                                {option.label}
                              </span>
                            </div>
                            {idx === scoreRangeOptions.length - 1 && (
                              <div className="h-[1px] bg-[#5e5e61]" />
                            )}
                          </>
                        ))}
                      </div>
                    )}
                  >
                    <div className="bg-black p-[16px] flex items-center justify-between rounded-[6px] cursor-pointer">
                      <div className="px-[18px] flex items-center gap-[8px]">
                        <img src={kresusAssets.chainIcon} alt="" />
                        <span className="font-roboto font-medium text-[14px] text-[#C7C7CC]">
                          Range
                        </span>
                      </div>
                      <img src={kresusAssets.iconDownward} alt="" />
                    </div>
                  </Dropdown>
                </div>
              )}
            >
              <div className="w-[45px] h-[45px] rounded-full bg-[#161616] flex items-center justify-center r-border cursor-pointer hover:bg-[#3A3A3C] transition-all">
                <img src={kresusAssets?.whiteFilter} alt="" />
              </div>
            </Dropdown>

            <div className="flex items-center gap-1">
              <CustomSearch
                placeholder="Search..."
                value={searchText}
                onChange={(value) => {
                  setSearchText(value);
                  setPagination((prev) => ({ ...prev, current: 1 }));
                }}
                onSearch={(value) => {
                  setSearchText(value);
                  setPagination((prev) => ({ ...prev, current: 1 }));
                }}
                error={typeof error === "string" ? error : null}
                onClear={() => {
                  setSearchText("");
                  setPagination((prev) => ({ ...prev, current: 1 }));
                }}
                className="px-[24px] py-[6px] rounded-[24px] bg-[#161616] r-border"
                inputClassName="w-full bg-transparent outline-none border-none text-white placeholder:text-[#7D7D7D] !bg-[#161616] font-roboto text-[16px] leading-[100%]"
              />
            </div>
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"> */}
          {/* Chain Selection */}
          {/* <div className="w-full sm:w-auto sm:min-w-[200px]">
              <Select
                value={selectedChain}
                onChange={(value) => {
                  setSelectedChain(value);
                  setPagination((prev) => ({ ...prev, current: 1 }));
                }}
                className="w-full custom-select-dropdown"
                size="middle"
                style={{
                  height: "40px",
                }}
                options={chainOptions}
              />
            </div> */}

          {/* Score Range Filter */}
          {/* <div className="w-full sm:w-auto sm:min-w-[200px]">
              <label className="block mb-1 font-bold text-xs sm:text-sm text-gray-700">
                Score Range
              </label>
              <Select
                value={scoreRange}
                onChange={(value) => {
                  setScoreRange(value);
                  setPagination((prev) => ({ ...prev, current: 1 }));
                }}
                className="w-full custom-select-dropdown"
                size="middle"
                style={{
                  height: "40px",
                }}
                options={scoreRangeOptions}
              />
            </div> */}

          {/* Score Sort */}
          {/* <div className="w-full sm:w-auto sm:min-w-[150px]">
              <label className="block mb-1 font-bold text-xs sm:text-sm text-gray-700">
                Score Sort
              </label>
              <Select
                value={scoreSort}
                onChange={(value) => {
                  setScoreSort(value);
                  setPagination((prev) => ({ ...prev, current: 1 }));
                }}
                className="w-full custom-select-dropdown"
                size="middle"
                style={{
                  height: "40px",
                }}
                options={sortOptions}
              />
            </div> */}

          {/* Date Sort */}
          {/* <div className="w-full sm:w-auto sm:min-w-[150px]">
              <label className="block mb-1 font-bold text-xs sm:text-sm text-gray-700">
                Date Sort
              </label>
              <Select
                value={dateSort}
                onChange={(value) => {
                  setDateSort(value);
                  setPagination((prev) => ({ ...prev, current: 1 }));
                }}
                className="w-full custom-select-dropdown"
                size="middle"
                style={{
                  height: "40px",
                }}
                options={sortOptions}
              />
            </div> */}
          {/* </div>  */}

          {/* right side - Total Tokens Count */}
          <div className="flex items-center justify-center gap-2  rounded-[30px] border-[2px] border-solid border-[#1A26E7] px-[30px] py-[16px] bg-[linear-gradient(314.39deg,#0734A9_0%,#0E1696_53.42%,#4B0792_98.92%)]">
            <span className="text-[#C7C7CC] font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-center align-middle">
              Total Spam Tokens:
            </span>
            <span className="font-roboto font-bold text-[16px] leading-[100%] tracking-[0] text-center align-middle text-[#FFFFFF]">
              {filteredTokens?.length ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div className=" ">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={paginatedTokens}
            rowKey="id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30", "50"],
              onChange: (page, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize || 20,
                }));
              },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              className: "px-4 py-2",
            }}
            className={classNames(
              "active-token-table",
              "hover:shadow-md transition-shadow duration-200",
              "[&_.ant-table-thead>tr>th]:bg-gray-100 [&_.ant-table-thead>tr>th]:py-3 [&_.ant-table-thead>tr>th]:text-base [&_.ant-table-thead>tr>th]:font-bold"
            )}
            scroll={{ x: "max-content" }}
            locale={{
              emptyText: (
                <div className="py-8 text-center">
                  <div className="text-gray-500 text-lg mb-2">
                    {searchText
                      ? "No spam tokens found matching your search"
                      : "No spam tokens available"}
                  </div>
                  {searchText && (
                    <Button
                      type="link"
                      onClick={() => {
                        setSearchText("");
                        setPagination((prev) => ({ ...prev, current: 1 }));
                      }}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ),
            }}
          />
        </Spin>
      </div>

      {/* CUSTOM MOVE MODAL */}
      <Modal
        title={null}
        open={isMoveModalVisible}
        onCancel={handleMoveModalCancel}
        footer={null}
        centered
        maskStyle={{
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          boxShadow: "20px 20px 20px 0px rgba(0, 0, 0, 0.08)",
          position: "relative",
        }}
        width={540}
        closable={false}
      >
        {/* Custom Close Button */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1000,
            transition: "all 0.2s ease",
            backgroundColor: "none",
          }}
          onClick={handleMoveModalCancel}
        >
          {/* Cross Icon */}
          <img src={kresusAssets?.crossIcon} alt="Cancel" />
        </div>

        <div
          style={{
            padding: "32px 24px",
            textAlign: "center",
            background: "#000000",
            color: "#FFFFFF",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#FFFFFF",
              lineHeight: "100%",
              letterSpacing: 0,
              fontStyle: "normal",
              marginBottom: "20px",
            }}
          >
            Are you sure you want to move this token?
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "14px",
              color: "#AEAEB2",
              marginBottom: "24px",
              lineHeight: "1.5",
            }}
          >
            Token will be moved to spam tokens
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="large"
              onClick={handleMoveModalCancel}
              className="custom-cancel-btn"
            >
              Cancel
            </Button>

            <Button
              size="large"
              onClick={handleMoveConfirm}
              className="custom-primary-btn"
            >
              Move to Spam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { SpamMechanism as default };
