import React, { useEffect, useMemo, useState } from "react";
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Input, message, Spin, Table } from "antd";
import axios from "axios";
import { kresusAssets } from "assets";

interface WaitlistUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface WaitlistResponse {
  waitlist: WaitlistUser[];
}

const WaitlistTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchWaitlistUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const iamUrl = import.meta.env.VITE_IAM_URL;
      const iamKey = import.meta.env.VITE_IAM_KEY;

      const response = await axios.get<WaitlistResponse>(
        `${iamUrl}/v1/user/waitlist`,
        {
          headers: {
            "x-api-key": iamKey,
            "Content-Type": "application/json",
          },
        }
      );

      const waitlistData = response.data.waitlist || [];
      setUsers(waitlistData);
      setPagination((prev) => ({ ...prev, total: waitlistData.length }));
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch waitlist users";
      setUsers([]);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date consistently
  const formatDateForCSV = (dateString: string): string => {
    const date = new Date(dateString);
    // Format as: YYYY-MM-DD HH:MM:SS
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const exportToCSV = async () => {
    setExportLoading(true);
    try {
      const iamUrl = import.meta.env.VITE_IAM_URL;
      const iamKey = import.meta.env.VITE_IAM_KEY;

      if (!iamUrl || !iamKey) {
        throw new Error("IAM configuration not found in environment variables");
      }

      const response = await axios.get<WaitlistResponse>(
        `${iamUrl}/v1/user/waitlist`,
        {
          headers: {
            "x-api-key": iamKey,
            "Content-Type": "application/json",
          },
        }
      );

      const allUsers = response.data.waitlist || [];

      // Create CSV content with better spacing using quoted fields
      const headers = ["Email", "Created At", "Updated At"];

      // Format all data with consistent spacing
      const formattedRows = allUsers.map((user) => [
        `"${user.email}"`,
        `"${formatDateForCSV(user.created_at)}"`,
        `"${formatDateForCSV(user.updated_at)}"`,
      ]);

      // Create CSV with proper spacing - using quoted fields ensures proper column separation
      const csvContent = [
        headers.map((h) => `"${h}"`).join(", "),
        ...formattedRows.map((row) => row.join(", ")),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `waitlist_users_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success(`Exported ${allUsers.length} users to CSV`);
    } catch (err: any ) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to export users";
      message.error(errorMessage);
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlistUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return users;

    const searchTerms = searchText.toLowerCase().trim().split(/\s+/);

    return users.filter((user) => {
      const searchableText = [
        user.email.toLowerCase(),
        user.id.toLowerCase(),
        new Date(user.created_at).toLocaleDateString().toLowerCase(),
        new Date(user.updated_at).toLocaleDateString().toLowerCase(),
      ].join(" ");

      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [users, searchText]);

  const paginatedUsers = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, pagination.current, pagination.pageSize]);

  const columns: TableProps<WaitlistUser>["columns"] = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (id) => <span className="font-mono text-sm">{id}</span>,
    //   sorter: (a, b) => a.id.localeCompare(b.id),
    //   width: 300,
    // },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="text-sm">{email}</span>,
      sorter: (a, b) => a.email.localeCompare(b.email),
      width: 300,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      width: 180,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      width: 180,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6 pb-8">
      {/* Main Content */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6">
        <div className="max-w-md px-[24px] py-[6px] rounded-[24px] bg-[#161616] r-border">
          <Input
            placeholder="Search by email or date"
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

        <div className="flex gap-4 items-end">
          <Button
            icon={<DownloadOutlined  className="text-black"/>}
            onClick={exportToCSV}
            loading={exportLoading}
            size="large"
            className=" !px-[24px] !h-[48px] !rounded-[30px] bg-white flex gap-[10px] justify-center items-center text-[#000000]   cursor-pointer hover:bg-gray-100 transition"
          >
            <p className="text-[16px] font-roboto font-medium text-[#000000]">Export</p>
          </Button>

          <Button
            type="default"
            onClick={fetchWaitlistUsers}
            loading={loading}
            size="large"
            style={{ height: "40px" }}
            className=" !px-[24px] !h-[48px] !rounded-[30px] bg-white flex gap-[10px] justify-center items-center text-[#000000]   cursor-pointer hover:bg-gray-100 transition"
            icon={<ReloadOutlined className="text-black"/>}
          >
            <p className="text-[16px] font-roboto font-medium text-[#000000]">Refresh</p>
          </Button>
        </div>
      </div>

      {/* Table */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={paginatedUsers}
          rowKey="id"
          pagination={{
            ...pagination,
            total: filteredUsers.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "15", "20", "30", "50"],
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 15,
              }));
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          className="active-token-table !border "
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: searchText
              ? "No users found matching your search"
              : "No users in waitlist",
          }}
        />
      </Spin>
    </div>
  );
};

export default WaitlistTable;
