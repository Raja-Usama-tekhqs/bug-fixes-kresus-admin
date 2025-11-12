import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  message,
  Checkbox,
  Spin,
  Select,
  Dropdown,
  Modal,
} from "antd";
import type { TableProps } from "antd";
import useApiClient from "hooks/useApiClient";
import "./styles.css";
import { kresusAssets } from "assets";

interface Token {
  token_address: string;
  chain: string;
  symbol: string;
  name: string | null;
  usd_price: string;
}

interface SaveTokenRequest {
  tokens: {
    token_address: string;
    chain: string;
  }[];
}

interface ApiError {
  message: string;
  details?: { message: string }[];
}

interface ActiveTokensProps {
  activeTab: string;
}

const chainOptions = [
  { label: "Solana Mainnet", value: "solana-mainnet" },
  { label: "Base Mainnet", value: "base-mainnet" },
  { label: "WorldChain Mainnet", value: "worldchain-mainnet" },
  { label: "Sui Mainnet", value: "sui-mainnet" },
];

const ActiveTokens: React.FC<ActiveTokensProps> = ({ activeTab }) => {
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [moveLoading, setMoveLoading] = useState<Record<string, boolean>>({});
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | ApiError | null>(null);

  // Modal states
  const [isMoveModalVisible, setIsMoveModalVisible] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  console.log(error, "error");
  const { getRequest, postRequest } = useApiClient();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  // const fetchTokens = async () => {
  //   if (!selectedChain) return;

  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const vaultURL = import.meta.env.VITE_REACT_APPLICATION_VAULT_URL;
  //     const response = await getRequest<Token[]>(
  //       `${vaultURL}spam-tokens/unique-list`,
  //       { chain: selectedChain }
  //     );
  //     setTokens(response || []);
  //     setPagination((prev) => ({ ...prev, total: response?.length || 0 }));
  //   } catch (err: any) {
  //     let msg: string | ApiError = "Failed to fetch tokens";
  //     if (err?.response?.data) {
  //       msg = err.response.data;
  //     } else if (err?.message) {
  //       msg = err.message;
  //     } else if (typeof err === "string") {
  //       msg = err;
  //     }
  //     setError(msg);
  //     setTokens([]);
  //     if (typeof msg === "string") {
  //       message.error(msg);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchTokens = async () => {
    setLoading(true);
    setError(null);

    try {
      const vaultURL = import.meta.env.VITE_REACT_APPLICATION_VAULT_URL;

      let response;

      if (!selectedChain) {
        // ⬇️ Fetch all chains when none is selected
        response = await getRequest<Token[]>(
          `${vaultURL}spam-tokens/unique-list`,
          {}
        );
      } else {
        // ⬇️ Fetch filtered by selected chain
        response = await getRequest<Token[]>(
          `${vaultURL}spam-tokens/unique-list`,
          {
            chain: selectedChain,
          }
        );
      }

      setTokens(response || []);
      setPagination((prev) => ({ ...prev, total: response?.length || 0 }));
    } catch (err: any) {
      let msg: string | ApiError = "Failed to fetch tokens";
      if (err?.response?.data) msg = err.response.data;
      else if (err?.message) msg = err.message;
      else if (typeof err === "string") msg = err;

      setError(msg);
      setTokens([]);
      if (typeof msg === "string") message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "active") {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchTokens();
    }
  }, [selectedChain, activeTab]);

  const handleSave = async () => {
    if (selectedTokens.size === 0) {
      message.warning("Please select at least one token");
      return;
    }

    setSaveLoading(true);
    setError(null);

    const tokensToSave: SaveTokenRequest = {
      tokens: [...selectedTokens].map((address) => ({
        token_address: address,
        chain: selectedChain,
      })),
    };

    try {
      const vaultURL = import.meta.env.VITE_REACT_APPLICATION_VAULT_URL;
      await postRequest<Record<string, never>>(
        `${vaultURL}spam-tokens`,
        tokensToSave
      );
      message.success("Tokens moved to spam successfully");
      setSelectedTokens(new Set());
      await fetchTokens();
    } catch (err: any) {
      let msg: string | ApiError = "Failed to save tokens";
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
      setSaveLoading(false);
    }
  };

  const handleMoveSingleToken = async (tokenAddress: string, chain: string) => {
    const key = `${tokenAddress}-${chain}`;
    setMoveLoading((prev) => ({ ...prev, [key]: true }));
    setError(null);

    try {
      const vaultURL = import.meta.env.VITE_REACT_APPLICATION_VAULT_URL;
      const tokensToSave: SaveTokenRequest = {
        tokens: [
          {
            token_address: tokenAddress,
            chain: chain,
          },
        ],
      };

      await postRequest<Record<string, never>>(
        `${vaultURL}spam-tokens`,
        tokensToSave
      );

      message.success("Token moved to spam successfully");
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

  // 👇 CUSTOM MODAL: Move confirmation for single token
  const showMoveConfirm = (token: Token): void => {
    setSelectedToken(token);
    setIsMoveModalVisible(true);
  };

  const handleMoveConfirm = (): void => {
    if (selectedToken) {
      handleMoveSingleToken(selectedToken.token_address, selectedToken.chain);
    }
    setIsMoveModalVisible(false);
    setSelectedToken(null);
  };

  const handleMoveModalCancel = (): void => {
    setIsMoveModalVisible(false);
    setSelectedToken(null);
  };

  const filteredTokens = useMemo(() => {
    if (!searchText.trim()) return tokens;

    const searchTerms = searchText.toLowerCase().trim().split(/\s+/);

    return tokens.filter((token) => {
      const searchableText = [
        token.name?.toLowerCase() || "",
        token.symbol?.toLowerCase() || "",
        token.token_address.toLowerCase(),
        token.chain.toLowerCase(),
      ].join(" ");

      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [tokens, searchText]);

  const paginatedTokens = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredTokens.slice(start, end);
  }, [filteredTokens, pagination.current, pagination.pageSize]);

  const columns: TableProps<Token>["columns"] = [
    {
      title: "Select",
      key: "select",
      width: 80,
      render: (_, record) => (
        <Checkbox
          checked={selectedTokens.has(record.token_address)}
          onChange={(e) => {
            const newSelected = new Set(selectedTokens);
            if (e.target.checked) {
              newSelected.add(record.token_address);
            } else {
              newSelected.delete(record.token_address);
            }
            setSelectedTokens(newSelected);
          }}
        />
      ),
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
      render: (name, record) => name || record.symbol || "N/A",
      sorter: (a, b) =>
        (a.name || a.symbol || "").localeCompare(b.name || b.symbol || ""),
    },
    {
      title: "Chain",
      dataIndex: "chain",
      key: "chain",
      render: (chain: string) =>
        chain
          .replace("-mainnet", "")
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      sorter: (a, b) => a.chain.localeCompare(b.chain),
    },
    {
      title: "USD Price",
      dataIndex: "usd_price",
      key: "usd_price",
      render: (price) => `$${Number(price).toFixed(6)}`,
      sorter: (a, b) => Number(a.usd_price) - Number(b.usd_price),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      align:'left',
      render: (_, record) => {
        const key = `${record.token_address}-${record.chain}`;
        const isMoveLoading = moveLoading[key] || false;

        return (
          <div className="flex flex-row gap-2 justify-start">
            <Button
              type="text"
              icon={<img src={kresusAssets.actionMoveIcon} alt="Move" />}
              size="small"
              className="flex items-center justify-center p-0 hover:opacity-80"
              loading={isMoveLoading}
              disabled={isMoveLoading}
              onClick={() => showMoveConfirm(record)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 mt-6 px-[10px] sm-[px-20px] md-[px-40px] lg-[px-120px]">
      <div className="flex flex-col sm:flex-row justify-start items-start sm:justify-between  sm:items-end gap-4 mb-6">
        <div className="flex items-center gap-2 order-1 flex-1">
          <Dropdown
            trigger={["hover"]}
            placement="bottomRight"
            dropdownRender={() => (
              <div
                className="bg-black text-white p-[24px] rounded-[16px] flex flex-col gap-2 !border !border-[#2C2C2E]
                            [box-shadow:-12px_12px_37px_0px_#4C377B1A,_-47px_47px_67px_0px_#4C377B17,_-106px_106px_90px_0px_#4C377B0D,_-188px_189px_107px_0px_#4C377B03,_-294px_295px_117px_0px_#4C377B00]"
              >
                {/* Header */}
                <div className="flex items-center gap-2 px-2 pb-2 border-b border-[#2C2C2E]">
                  <img
                    src={kresusAssets?.tokenDropdownIcon}
                    alt=""
                    className="w-6 h-6 text-[#AEAEB2]"
                  />
                  <span className="font-roboto font-semibold leading-[100%] tracking-[0] text-[#AEAEB2] text-[16px]">
                    Select Chain
                  </span>
                </div>

                {/* Menu items */}
                <div className="mt-2 flex flex-col gap-2">
                  {chainOptions.map((opt) => (
                    <div key={opt?.value}>
                      <div
                        onClick={() => setSelectedChain(opt?.value)}
                        className={`flex items-center gap-3 px-[28px] py-[16px] cursor-pointer rounded-md transition-all
          ${
            selectedChain === opt?.value
              ? "bg-[#5f5f64]" // Light gray when selected
              : "hover:bg-[#1C1C1E] text-[#C7C7CC] hover:text-white"
          }`}
                      >
                        <img
                          src={kresusAssets?.chainIcon}
                          alt=""
                          className="w-6 h-6"
                        />
                        <span className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0]">
                          {opt?.label}
                        </span>
                      </div>
                      <div className="h-[1px] bg-[#2C2C2E] mx-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          >
            <div className="w-[40px] h-[40px] rounded-full p-2 r-border bg-[#161616] flex items-center justify-center border border-[#2C2C2E] cursor-pointer hover:bg-[#3A3A3C] transition-all">
              <img
                src={kresusAssets?.whiteFilter}
                alt=""
                width={24}
                height={24}
              />
            </div>
          </Dropdown>

          <div className="max-w-md px-[24px] py-[6px] rounded-[24px] bg-[#161616] r-border">
            <Input
              placeholder="Search by name, symbol, token address or chain"
              suffix={<img src={kresusAssets.searchIcon} className="" />}
              value={searchText}
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
              allowClear
              variant="borderless"
              size="large"
              style={{
                height: "40px",
                backgroundColor: "transparent",
                color: "white",
                fontSize: "16px",
                fontFamily: "Roboto, sans-serif",
              }}
              classNames={{
                input: "text-white placeholder:text-[#7D7D7D]",
              }}
            />
          </div>
        </div>

        <div className="flex gap-0 md:gap-4 !items-start md:items-end order-2">
          {selectedTokens.size > 0 && (
            <Button
              type="primary"
              danger
              onClick={handleSave}
              disabled={saveLoading}
              loading={saveLoading}
              className="!bg-[#BA2130] !rounded-[24px] !w-[183px] !h-[48px] !px-[24px] !py-[12px] flex items-center justify-center gap-[10px] !opacity-100"
            >
              <span className="px-[4px] py-[1px]">
                <img src={kresusAssets.moveToSpamIcon} alt="" />
              </span>
              <span className="font-roboto font-medium text-[16px] leading-[100%] tracking-[0] text-center align-middle">
                Move to Spam
              </span>
            </Button>
          )}
        </div>
      </div>

      <div className="">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={paginatedTokens}
            rowKey="token_address"
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
            }}
            className="active-token-table !border "
            scroll={{ x: "max-content" }}
            locale={{
              emptyText: searchText
                ? "No tokens found matching your search"
                : "No tokens available",
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
          <img src={kresusAssets.crossIcon} alt="" />
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
            Do you want to move token to spam?
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
              onClick={handleMoveModalCancel}
              className="custom-cancel-btn"
            >
              Cancel
            </Button>

            <Button onClick={handleMoveConfirm} className="custom-primary-btn">
              Move to Spam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActiveTokens;
