import { Card, Skeleton, Image } from "antd";
import { useMemo } from "react";
import { kresusAssets } from "assets"; // same source as VolumeAnalytics

interface TransactionItem {
  chain: string;
  total_transaction: number;
  sent_transaction: number;
  received_transaction: number;
  swapped_transaction: number;
  dapp_transaction?: number;
  usdcDepositCount?: number;
  solDepositCount?: number;
  usdcWithdrawCount?: number;
  solWithdrawCount?: number;
}

interface EarnMetrics {
  totalUsdcTransactions: number;
  totalSolTransactions: number;
  usdcDepositCount: number;
  solDepositCount: number;
  usdcWithdrawCount: number;
  solWithdrawCount: number;
}

interface TransactionAnalyticsProps {
  transactionData: TransactionItem[];
  earnMetrics: EarnMetrics;
  loading: boolean;
}

const TransactionAnalytics: React.FC<TransactionAnalyticsProps> = ({
  transactionData,
  earnMetrics,
  loading,
}) => {
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
            src={kresusAssets.solana}
            alt="Solana"
            width={32}
            height={32}
            preview={false}
          />
        );
      case "base-mainnet":
        return (
          <Image
            src={kresusAssets.base}
            alt="Base"
            width={32}
            height={32}
            preview={false}
          />
        );
      case "worldchain-mainnet":
        return (
          <Image
            src={kresusAssets.worldChain}
            alt="WorldChain"
            width={32}
            height={32}
            preview={false}
          />
        );
      default:
        return <img src={kresusAssets?.sui} alt="" width={32} height={32} />;
    }
  };

  const augmentedTransactionData = useMemo(
    () =>
      transactionData.map((t) => {
        if (t.chain === "solana-mainnet") {
          const totalTransactions =
            t.total_transaction +
            earnMetrics.totalUsdcTransactions +
            earnMetrics.totalSolTransactions;
          return {
            ...t,
            total_transaction: totalTransactions,
            usdcDepositCount: earnMetrics.usdcDepositCount,
            solDepositCount: earnMetrics.solDepositCount,
            usdcWithdrawCount: earnMetrics.usdcWithdrawCount,
            solWithdrawCount: earnMetrics.solWithdrawCount,
          };
        }
        return t;
      }),
    [transactionData, earnMetrics]
  );

  const getFilteredFields = (chain: string, item: any) => {
    const baseFields = [
      ["Total Transactions", "total_transaction"],
      ["Sent Transactions", "sent_transaction"],
      ["Received Transactions", "received_transaction"],
      ["Swapped Transactions", "swapped_transaction"],
      ["Dapp Transactions", "dapp_transaction"],
    ];

    let filteredFields =
      chain === "worldchain-mainnet"
        ? baseFields.filter(([label]) => !label.includes("Swapped"))
        : baseFields;

    filteredFields = filteredFields.filter(([label, key]) => {
      if (label.includes("Dapp")) {
        const value = item[key];
        return value !== undefined && value !== null && Number(value) !== 0;
      }
      return true;
    });

    if (chain === "solana-mainnet") {
      const solanaSpecificFields = [
        ["USDC Deposit Count", "usdcDepositCount"],
        ["SOL Deposit Count", "solDepositCount"],
        ["USDC Withdraw Count", "usdcWithdrawCount"],
        ["SOL Withdraw Count", "solWithdrawCount"],
      ];
      solanaSpecificFields.forEach((field) => filteredFields.push(field));
    }

    return filteredFields;
  };

  const finalData = loading
    ? [1, 2]
    : augmentedTransactionData.length > 0
    ? augmentedTransactionData
    : [
        {
          chain: "N/A",
          total_transaction: 0,
          sent_transaction: 0,
          received_transaction: 0,
          swapped_transaction: 0,
          dapp_transaction: 0,
        },
      ];

  return (
    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 mt-2 sm:mt-7">
      <div className="overflow-x-auto px-1 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-auto">
          {(finalData as TransactionItem[])?.map(
            (item: TransactionItem, idx: number) => {
              let heightClass = "";

              if (idx === 0) {
                heightClass = "lg:min-h-[660px] lg:max-h-[660px]"; // 1st card
              } else if (idx === 3) {
                heightClass = "lg:min-h-[180px] lg:max-h-[180px]"; // 4th card
              } else if (idx === 1 || idx === 2) {
                heightClass = "lg:min-h-[290px] lg:max-h-[290px]"; // 2nd & 3rd cards
              } else {
                heightClass = "lg:min-h-[180px] lg:max-h-[180px]";
              }
              return (
                <div
                  key={loading ? idx : item.chain}
                  className={`
          ${idx === 0 ? "lg:row-span-2" : ""}
          ${idx === 3 ? "lg:col-span-2" : ""}
          ${idx === 4 ? "lg:col-span-3" : ""}
        `}
                >
                  <Card
                    title={
                      loading ? (
                        <Skeleton.Input active size="small" />
                      ) : (
                        <div
                          className={`flex ${
                            idx === 3 || idx === 4
                              ? "flex-row items-center"
                              : "flex-col"
                          } gap-2 ps-[2px]`}
                        >
                          {renderChainIcon(item.chain)}
                          <span className="font-roboto font-medium text-[20px] sm:text-[32px] leading-[100%] tracking-[0] capitalize text-[#FFFFFF]">
                            {renderChainTitle(item.chain)}
                          </span>
                        </div>
                      )
                    }
                    className="!bg-[#161616] !border-none !shadow-none !rounded-[24px] !p-[24px] h-full"
                    headStyle={{
                      background: "transparent",
                      borderBottom: "none",
                    }}
                  >
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 4 }} />
                    ) : (
                      <div
                        className={`bg-[#000000] rounded-[24px] px-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${heightClass}`}
                      >
                        {getFilteredFields(item.chain, item)?.map(
                          ([label, key]) => (
                            <div
                              key={label}
                              className="flex justify-between gap-[18px] items-center card-border-bottom  py-5"
                            >
                              <span className="font-roboto font-normal text-[12px] sm:text-[16px] leading-[100%] tracking-[0px] text-[#C7C7CC]">
                                {label}
                              </span>
                              <span className="font-roboto font-normal text-[12px] sm:text-[16px] leading-[100%] tracking-[0px] text-right text-[#7654FE]">
                                {Number((item as any)[key]).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionAnalytics;
