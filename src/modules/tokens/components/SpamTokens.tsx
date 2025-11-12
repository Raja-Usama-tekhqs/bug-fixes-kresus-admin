import type { TableProps } from "antd";
import { Button, Dropdown, message, Spin, Table, Modal } from "antd";
import classNames from "classnames";
import useApiClient from "hooks/useApiClient";
import React, { useEffect, useMemo, useState } from "react";
import CustomSearch from "../../../components/CustomSearch/CustomSearch";
import "./styles.css";
import { kresusAssets } from "assets";

interface Token {
  token_address: string;
  chain: string;
  symbol: string;
  name: string;
  usd_price: string;
  is_automated: boolean | null | undefined;
  created_at: string;
}

interface ApiError {
  message: string;
  details?: { message: string }[];
}

interface SpamTokensProps {
  activeTab: string;
}

interface OptionType {
  value: string;
  label: string;
}

const SpamTokens: React.FC<SpamTokensProps> = ({ activeTab }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [moveLoading, setMoveLoading] = useState<Record<string, boolean>>({});
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchText, setSearchText] = useState("");
  const [automatedFilter, setAutomatedFilter] = useState<string>("all");
  const [error, setError] = useState<string | ApiError | null>(null);

  // Modal states
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  console.log(error, "error");
  const { getRequest, deleteRequest, patchRequest } = useApiClient();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchTokens = async () => {
    setLoading(true);
    setError(null);
    try {
      const vaultURL = import.meta.env
        .VITE_REACT_APPLICATION_VAULT_URL as string;
      const response = await getRequest<Token[]>(
        `${vaultURL}spam-tokens/unique-spam-list`,
        {}
      );
      setTokens(response || []);
      console.log("Here are tokens...............", response);

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
    if (activeTab === "spam") {
      fetchTokens();
    }
  }, [activeTab]);

  const handleDelete = async (tokenAddress: string, chain: string) => {
    const key = `${tokenAddress}-${chain}`;
    setDeleteLoading((prev) => ({ ...prev, [key]: true }));
    setError(null);

    try {
      const vaultURL = import.meta.env
        .VITE_REACT_APPLICATION_VAULT_URL as string;
      await deleteRequest<Record<string, never>>(
        `${vaultURL}spam-tokens/${tokenAddress}/${chain}`
      );

      message.success("Token removed from spam list");
      await fetchTokens();
    } catch (err: any) {
      let msg: string | ApiError = "Failed to remove token from spam list";
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
      setDeleteLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

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

      await patchRequest<Record<string, never>>(
        `${vaultURL}spam-tokens/move`,
        payload
      );

      message.success("Token moved successfully");
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

  // 👇 CUSTOM MODAL: Delete confirmation
  const showDeleteConfirm = (token: Token): void => {
    setSelectedToken(token);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = (): void => {
    if (selectedToken) {
      handleDelete(selectedToken.token_address, selectedToken.chain);
    }
    setIsDeleteModalVisible(false);
    setSelectedToken(null);
  };

  const handleDeleteModalCancel = (): void => {
    setIsDeleteModalVisible(false);
    setSelectedToken(null);
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

    if (automatedFilter !== "all") {
      if (automatedFilter === "true") {
        filtered = filtered.filter((token) => token.is_automated === true);
      } else if (automatedFilter === "false") {
        filtered = filtered.filter((token) => token.is_automated === false);
      }
    }

    if (searchText.trim()) {
      const searchTerms = searchText.toLowerCase().trim().split(/\s+/);
      filtered = filtered.filter((token) => {
        const searchableText = [
          token.name?.toLowerCase() || "",
          token.symbol?.toLowerCase() || "",
          token.token_address.toLowerCase(),
          token.chain.toLowerCase(),
        ].join(" ");

        return searchTerms.every((term) => searchableText.includes(term));
      });
    }

    return filtered;
  }, [tokens, searchText, automatedFilter]);

  const automatedOptions: OptionType[] = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
  ];

  const paginatedTokens = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredTokens.slice(start, end);
  }, [filteredTokens, pagination.current, pagination.pageSize]);

  const columns: TableProps<Token>["columns"] = [
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
      render: (chain) =>
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
      render: (price: string) => `$${Number(price).toFixed(2)}`,
      sorter: (a, b) => Number(a.usd_price) - Number(b.usd_price),
    },
    {
      title: "Automated",
      dataIndex: "is_automated",
      key: "is_automated",
      render: (isAutomated: boolean | null | undefined) => {
        if (isAutomated === null || isAutomated === undefined) {
          return (
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800 font-bold">
              N/A
            </span>
          );
        }

        return (
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
              isAutomated
                ? "bg-[#248A3D33] text-[#34C759]  font-roboto font-normal text-[14px] leading-[100%] tracking-[0] rounded-[12px] px-[8px] py-[4px]"
                : "bg-[#BA213033] text-[#BA2130]  font-roboto font-normal text-[14px] leading-[100%] tracking-[0] rounded-[12px] px-[8px] py-[4px]"
            }`}
          >
            {isAutomated ? "True" : "False"}
          </span>
        );
      },
      sorter: (a, b) => Number(a.is_automated) - Number(b.is_automated),
    },
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
          <div className="flex flex-row justify-center gap-2">
            <Button
              type="text"
              icon={<img src={kresusAssets.actionIcon} alt="Remove" />}
              size="small"
              className="flex items-center justify-center p-0 hover:opacity-80"
              loading={isDeleteLoading}
              disabled={isAnyLoading}
              onClick={() => showDeleteConfirm(record)}
            />

            {/* <Button
              type="text"
              icon={<img src={kresusAssets.actionMoveIcon} alt="Move" />}
              size="small"
              className="flex items-center justify-center p-0 hover:opacity-80"
              loading={isMoveLoading}
              disabled={isAnyLoading}
              onClick={() => showMoveConfirm(record)}
            />   */}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="mb-4 sm:mb-6  brounded-lg shadow-sm ">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-1">
              <Dropdown
                trigger={["hover"]}
                placement="bottomRight"
                dropdownRender={() => (
                  <div
                    className="bg-black text-white w-[325px] p-[24px] rounded-[16px]  flex flex-col gap-2 !border !border-[#2C2C2E]
                            [box-shadow:-12px_12px_37px_0px_#4C377B1A,_-47px_47px_67px_0px_#4C377B17,_-106px_106px_90px_0px_#4C377B0D,_-188px_189px_107px_0px_#4C377B03,_-294px_295px_117px_0px_#4C377B00]"
                  >
                    <div className="flex items-center gap-2 px-2 pb-2 border-b border-[#2C2C2E]">
                      <img
                        src={kresusAssets?.tokenDropdownIcon}
                        alt=""
                        className="w-6 h-6 text-[#AEAEB2]"
                      />
                      <span className="font-roboto font-semibold leading-[100%] tracking-[0] text-[#AEAEB2] text-[16px]">
                        Select Automated Status
                      </span>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                      {automatedOptions.map((opt) => (
                        <div key={opt?.value}>
                          <div
                            onClick={() => {
                              setAutomatedFilter(opt.value);
                              setPagination((prev) => ({
                                ...prev,
                                current: 1,
                              }));
                            }}
                            className={`flex items-center gap-3 px-[28px] py-[16px] cursor-pointer rounded-md transition-all
                              ${
                                automatedFilter === opt.value
                                  ? "bg-[#5f5f64]" // ✅ very light gray when selected
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
                <div className="w-[45px] h-[45px] rounded-full bg-[#161616] flex items-center justify-center r-border cursor-pointer hover:bg-[#3A3A3C] transition-all">
                  <img src={kresusAssets?.whiteFilter} alt="" />
                </div>
              </Dropdown>

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
                className="px-[24px] py-[6px] rounded-[24px] bg-[#161616] r-border "
                inputClassName="w-full bg-transparent outline-none border-none text-white placeholder:text-[#7D7D7D] !bg-[#161616] font-roboto text-[16px] leading-[100%]"
              />
            </div>
          </div>

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

      <div className="rounded-lg  overflow-hidden">
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
              className: "px-4 py-2",
            }}
            className={classNames(
              "active-token-table ",
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

      {/* CUSTOM DELETE MODAL */}
      <Modal
        title={null}
        open={isDeleteModalVisible}
        onCancel={handleDeleteModalCancel}
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
          position: "relative", // Needed for absolute positioning of close button
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
          onClick={handleDeleteModalCancel}
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
              fontSize: "20px",
              fontWeight: "600",
              color: "#FFFFFF",
              marginBottom: "8px",
              lineHeight: "1.4",
            }}
          >
            Do you want to move it to Active Tokens?
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
            Token will be moved to Active tokens.
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
              onClick={handleDeleteModalCancel}
              className="custom-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              size="large"
              onClick={handleDeleteConfirm}
              className="custom-move-btn"
            >
              Move
            </Button>
          </div>
        </div>
      </Modal>

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
              //   size="large"
              onClick={handleMoveModalCancel}
              className="custom-cancel-btn"
            >
              Cancel
            </Button>

            <Button
              //   size="large"
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

export { SpamTokens as default };
