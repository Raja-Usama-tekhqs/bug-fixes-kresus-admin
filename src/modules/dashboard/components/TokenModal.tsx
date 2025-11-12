import type { TableProps, TabsProps } from "antd";
import { Button, message, Modal, Spin, Table, Tabs } from "antd";
import { kresusAssets } from "assets";
import useApiClient from "hooks/useApiClient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { chainIcon, Token } from "./analyticsHolding";

// Types
interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: { [chain: string]: Token[] };
  totalUsd: number;
  email: string;
  address: string;
  solana_address: string;
}

interface SpamTokensResponse {
  spamTokens?: { [chain: string]: Token[] };
  error?: string;
}

interface ChainSummary {
  chain: string;
  total: number;
  tokenCount: number;
  sortedTokens: Token[];
}

interface SortConfig {
  key: string;
  order: "ascend" | "descend" | null;
}

// Constants
const CHAIN_NAME_MAP: Record<string, string> = {
  "base-mainnet": "Base",
  "solana-mainnet": "Solana",
  "worldchain-mainnet": "WLD",
  "sui-mainnet":"Sui"
};

const BALANCE_DECIMAL_PLACES = 6;
const USD_DECIMAL_PLACES = 2;

// Utility functions
const formatChainName = (chain: string): string => {
  return CHAIN_NAME_MAP[chain] || chain;
};

const truncateAddress = (address: string): string => {
  if (!address) return "";
  const start = address.slice(0, 4);
  const end = address.slice(-4);
  return `${start}...${end}`;
};

const formatBalance = (value: string): string => {
  return parseFloat(value).toFixed(BALANCE_DECIMAL_PLACES);
};

const formatUsdValue = (value: string): string => {
  return `$${parseFloat(value).toFixed(USD_DECIMAL_PLACES)}`;
};

const parseNumericValue = (value: string | null | undefined): number => {
  return parseFloat(value || "0");
};

// Sub-components
const CopyButton: React.FC<{
  text: string;
  onCopy: (text: string) => void;
}> = ({ text, onCopy }) => (
  <button
    onClick={() => onCopy(text)}
    className="ml-2 p-1 hover:cursor-pointer  rounded-full bg-black border-none "
    aria-label="Copy address"
  >
    <img src={kresusAssets.copyIcon} alt="" width={20} height={20} />
  </button>
);

const ChainSummaryCard: React.FC<{ summary: ChainSummary }> = ({ summary }) => (
  <div
  
    key={summary.chain}
    className="chain-card flex flex-col gap-2"
    data-chain={summary.chain}
  >

    <div className="chain-header">
      <span className="chain-name">
        <span className="">{chainIcon(summary.chain, 12)} </span>
        <span>{formatChainName(summary.chain)}</span>
      </span>
      <span className="token-count">{summary.tokenCount} tokens</span>
    </div>
    <div className="chain-value">
      ${summary.total.toFixed(USD_DECIMAL_PLACES)}
    </div>
   
  </div>
);

// Main component
const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  tokens,
  totalUsd,
  email,
  address,
  solana_address,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<string>("details");

  const [spamTokens, setSpamTokens] = useState<SpamTokensResponse | null>(null);
  const [spamLoading, setSpamLoading] = useState(false);
  const { getRequest } = useApiClient();
console.log('here are the tokens.................',tokens)
  // Memoized values
  const totalTokenCount = useMemo(
    () => Object.values(tokens).reduce((sum, tokens) => sum + tokens.length, 0),
    [tokens]
  );

  const chainSummaries = useMemo(
    (): ChainSummary[] =>
      Object.entries(tokens).map(([chain, chainTokens]) => {
        const sortedChainTokens = [...chainTokens].sort((a, b) => {
          const aValue = parseNumericValue(a.usd_balance_formatted);
          const bValue = parseNumericValue(b.usd_balance_formatted);
          return bValue - aValue;
        });
        const chainTotal = sortedChainTokens.reduce(
          (sum, token) => sum + parseNumericValue(token.usd_balance_formatted),
          0
        );
        return {
          chain,
          total: chainTotal,
          tokenCount: chainTokens.length,
          sortedTokens: sortedChainTokens,
        };
      }),
    [tokens]
  );

  // Columns for different tables
  const detailsColumns = useMemo(
    () => [
      {
        title: (
          <span className="font-roboto font-medium not-italic text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            Email
          </span>
        ),
        dataIndex: "email",
        key: "email",
        render: (text: string) =>
          text ? (
            <span className="text-[#4898F3] font-roboto font-normal text-[14px] leading-[100%] tracking-[0] align-middle underline decoration-solid decoration-auto  underline-offset-[0px]">
              {text}
            </span>
          ) : (
            "N/A"
          ),
      },
      {
        title: (
          <span className="text-[#FFFFFF] font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle">
            Base Address
          </span>
        ),
        dataIndex: "baseAddress",
        key: "baseAddress",
        render: (text: string) => (
          <span className="flex items-center">
            <span className="font-roboto font-normal not-italic text-[14px] leading-[100%] tracking-[0] align-middle text-[#C7C7CC]">
              {truncateAddress(text)}
            </span>
            <CopyButton text={text} onCopy={handleCopyAddress} />
          </span>
        ),
      },
      {
        title: (
          <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            Solana Address
          </span>
        ),
        dataIndex: "solanaAddress",
        key: "solanaAddress",
        render: (text: string) => (
          <span className="flex items-center">
            {truncateAddress(text)}
            <CopyButton text={text} onCopy={handleCopyAddress} />
          </span>
        ),
      },
    ],
    []
  );

  const activeTokenColumns = useMemo(
    () => [
      {
        title: (
          <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            Chain Token
          </span>
        ),
        dataIndex: "chain",
        key: "chain",
        render: (chain: string) => (
          <span className="font-inter font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            {formatChainName(chain)}
          </span>
        ),
        width: 100,
      },
      {
        title: (
          <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            Token Name
          </span>
        ),
        dataIndex: "name",
        key: "name",
        render: (text: string | null) => (
          <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0] align-middle text-[#C7C7CC]">
            {text || "Unknown"}
          </span>
        ),
        width: 120,
        ellipsis: true,
        sorter: (a: Token, b: Token) =>
          (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: (
          <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            Balance
          </span>
        ),
        dataIndex: "balance_formatted",
        key: "balance",
        render: (text: string) => (
          <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0] align-middle text-[#C7C7CC]">
            {formatBalance(text)}
          </span>
        ),
        width: 100,
        align: "right" as const,
        sorter: (a: Token, b: Token) => {
          const aValue = parseNumericValue(a.balance_formatted);
          const bValue = parseNumericValue(b.balance_formatted);
          return aValue - bValue;
        },
      },
      {
        title: (
          <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            USD Value
          </span>
        ),
        dataIndex: "usd_balance_formatted",
        key: "usd_value",
        render: (value: string) => (
          <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0] align-middle text-[#C7C7CC]">
            {formatUsdValue(value)}
          </span>
        ),
        width: 100,
        align: "right" as const,
        sorter: (a: Token, b: Token) => {
          const aValue = parseNumericValue(a.usd_balance_formatted);
          const bValue = parseNumericValue(b.usd_balance_formatted);
          return aValue - bValue;
        },
      },
    ],
    []
  );

  const spamTokenColumns = useMemo(
    () => [
      {
        title: (
          <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            Chain Token
          </span>
        ),
        dataIndex: "chain",
        key: "chain",
        render: (chain: string) => (
          <span className="font-inter font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            {formatChainName(chain)}
          </span>
        ),
        width: 100,
      },
      {
        title: (
          <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            Token Name
          </span>
        ),
        dataIndex: "name",
        key: "name",
        render: (text: string | null) => (
          <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0] align-middle text-[#C7C7CC]">
            {text || "Unknown"}
          </span>
        ),
        width: 120,
        ellipsis: true,
      },
      {
        title: (
          <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            Balance
          </span>
        ),
        dataIndex: "balance_formatted",
        key: "balance",
        render: (text: string) => (
          <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0] align-middle text-[#C7C7CC]">
            {formatBalance(text)}
          </span>
        ),
        width: 100,
        align: "right" as const,
      },
      {
        title: (
          <span className="font-roboto font-medium text-[14px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
            USD Value
          </span>
        ),
        dataIndex: "usd_balance_formatted",
        key: "usd_value",
        render: (value: string) => (
          <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0] align-middle text-[#C7C7CC]">
            {formatUsdValue(value)}
          </span>
        ),
        width: 100,
        align: "right" as const,
      },
    ],
    []
  );

  // Data for tables
  const detailsData = useMemo(
    () => [
      {
        key: "1",
        email: email,
        baseAddress: address,
        solanaAddress: solana_address,
      },
    ],
    [email, address, solana_address]
  );

  const activeTokensData = useMemo(() => {
    const allTokens: (Token & { chain: string })[] = [];
    Object.entries(tokens).forEach(([chain, chainTokens]) => {
      chainTokens.forEach((token) => {
        allTokens.push({ ...token, chain });
      });
    });
    return allTokens;
  }, [tokens]);

  const spamTokensData = useMemo(() => {
    if (!spamTokens?.spamTokens) return [];
    const allSpamTokens: (Token & { chain: string })[] = [];
    Object.entries(spamTokens.spamTokens).forEach(([chain, chainTokens]) => {
      chainTokens.forEach((token) => {
        allSpamTokens.push({ ...token, chain });
      });
    });
    return allSpamTokens;
  }, [spamTokens]);

  // Callbacks
  const fetchSpamTokens = useCallback(async () => {
    setSpamLoading(true);
    setSpamTokens(null);
    try {
      const vaultURL = import.meta.env.VITE_REACT_APPLICATION_VAULT_URL;
      const params: Record<string, string> = { address };
      if (solana_address) params.solana = solana_address;
      const res = await getRequest<SpamTokensResponse>(
        `${vaultURL}analytics/spamTokens`,
        params
      );
      setSpamTokens(res);
    } catch (err) {
      setSpamTokens({ error: "Failed to fetch spam tokens" });
    } finally {
      setSpamLoading(false);
    }
  }, [address, solana_address]);

  const handleCopyAddress = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Address copied to clipboard");
    } catch (err) {
      message.error("Failed to copy address");
    }
  }, []);

  const handleTableChange: TableProps<Token>["onChange"] = useCallback(
    (sorter: any) => {
      if (Array.isArray(sorter)) return;
      // Sort config removed - no longer needed
    },
    []
  );

  // Main tabs configuration
  // Main tabs configuration
  const mainTabItems: TabsProps["items"] = useMemo(
    () => [
      {
        key: "details",
        label: <div className="tab-label">Details</div>,
        children: (
          <div className="mt-4 bg-[#161616] p-[16px] rounded-[24px]">
            <Table
              dataSource={detailsData}
              columns={detailsColumns}
              pagination={false}
              size="small"
              className="token-modal-table"
              // scroll={TABLE_SCROLL_CONFIG}
            />
          </div>
        ),
      },
      {
        key: "active",
        label: <div className="tab-label">Active Tokens</div>,
        children: (
          <div className="mt-4 bg-[#161616] p-[16px] rounded-[24px]">
            <Table
              dataSource={activeTokensData}
              columns={activeTokenColumns}
              rowKey={(record) => `${record.chain}-${record.token_address}`}
              pagination={false}
              size="small"
              className="token-modal-table"
              // scroll={TABLE_SCROLL_CONFIG}
              onChange={handleTableChange}
              sortDirections={["ascend", "descend"]}
            />
          </div>
        ),
      },
      {
        key: "spam",
        label: <div className="tab-label">Spam Tokens</div>,
        children: (
          <div className="mt-4 bg-[#161616] p-[16px] rounded-[24px]">
            {spamLoading ? (
              <div className="text-center py-8">
                <Spin size="large" />
              </div>
            ) : spamTokens?.error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{spamTokens.error}</p>
                <Button size="small" onClick={fetchSpamTokens}>
                  Retry
                </Button>
              </div>
            ) : (
              <Table
                dataSource={spamTokensData}
                columns={spamTokenColumns}
                rowKey={(record) => `${record.chain}-${record.token_address}`}
                pagination={false}
                size="small"
                className="token-modal-table"
                //   scroll={TABLE_SCROLL_CONFIG}
              />
            )}
          </div>
        ),
      },
    ],
    [
      detailsData,
      detailsColumns,
      activeTokensData,
      activeTokenColumns,
      spamTokensData,
      spamTokenColumns,
      spamLoading,
      spamTokens,
      handleTableChange,
      fetchSpamTokens,
    ]
  );

  // Effects
  useEffect(() => {
    if (isOpen && address) {
      fetchSpamTokens();
    }
    if (!isOpen) {
      setSpamTokens(null);
      setSpamLoading(false);
    }
  }, [isOpen, address, solana_address]);

  return (
    <Modal
      title={
        <div>
          <h3 className="font-roboto font-semibold text-[24px] leading-[100%] tracking-[0] text-[#FFFFFF]">
            Token Details
          </h3>
          <p className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0] align-middle text-[#C7C7CC]">
            TXT Record and Verification
          </p>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={652}
      className="token-modal"
    >
      {/* Chain Summary Cards */}
      <div className="chain-summary mb-6">
        
        {chainSummaries.map((summary) => (
          
          <ChainSummaryCard key={summary.chain} summary={summary} />
        ))}
        <div className="chain-card total-card flex flex-col gap-2">
          <div className="chain-header">
            <span className="chain-name flex items-center gap-1">
              <img src={kresusAssets.totalAmount} alt="Total" />
              Total
            </span>
            <span className="chain-value flex items-center">
              {totalTokenCount} tokens
            </span>
          </div>
          <div className="font-roboto font-semibold text-[16px] leading-[100%] tracking-[0px] text-[#FFFFFF]">
            ${totalUsd.toFixed(USD_DECIMAL_PLACES)}
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs
        activeKey={activeMainTab}
        onChange={setActiveMainTab}
        items={mainTabItems}
        className="custom-modal-tabs"
        tabBarStyle={{
          background: "#000000",
          borderRadius: "40px",
        }}
      />
    </Modal>
  );
};
 
export default TokenModal;
