import { useState } from "react";
import { Dropdown, MenuProps, Spin } from "antd";
import { CiExport } from "react-icons/ci";
import { MdExpandMore } from "react-icons/md";
import useApiClient from "hooks/useApiClient";
import { kresusAssets } from "assets";

interface ExportHoldingProps {
  start_date?: string;
  end_date?: string;
}

interface ExportResponse {
  status: string;
  jobId: string;
}

interface JobStatusResponse {
  job: {
    status: "pending" | "complete";
    fileUrl?: string;
  };
}

type ExportType = "tokens" | "emails" | "";

const ExportHolding: React.FC<ExportHoldingProps> = ({
  start_date,
  end_date,
}) => {
  const [loading, setLoading] = useState(false);
  const { getRequest } = useApiClient();
  const vaultURL = import.meta.env.VITE_REACT_APPLICATION_VAULT_URL;

  const checkJobStatus = async (jobId: string) => {
    try {
      const response = await getRequest<JobStatusResponse>(
        `${vaultURL}analytics/csv-status`,
        { jobId }
      );

      if (response.job.status === "complete" && response.job.fileUrl) {
        window.location.href = response.job.fileUrl;
        setLoading(false);
      } else if (response.job.status === "pending") {
        setTimeout(() => checkJobStatus(jobId), 3000);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleExport = async (type: ExportType) => {
    if (!type) return;
    setLoading(true);
    try {
      const response = await getRequest<ExportResponse>(
        `${vaultURL}analytics/holding-csv`,
        {
          type,
          ...(start_date && { start_date }),
          ...(end_date && { end_date }),
        }
      );
      if (response.jobId) {
        checkJobStatus(response.jobId);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // ✅ Dropdown menu items
  const items: MenuProps["items"] = [
    {
      key: "title",
      disabled: true,
      label: (
        <div className="flex items-center gap-2 text-[#AEAEB2]">
          <img
            src={kresusAssets?.tokenDropdownIcon}
            alt=""
            className="w-4 h-4 sm:w-5 sm:h-5"
          />

          <span className=" text-[#AEAEB2] font-roboto font-semibold text-[16px] leading-[100%] tracking-[0%]">
            Export Type
          </span>
        </div>
      ),
    },

    {
      key: "tokens",
      label: (
        <div className="flex items-center  px-[18px] gap-[8px] py-4  hover:bg-[#111111] transition border b-bottom">
          <img src={kresusAssets?.chainIcon} alt="" />{" "}
          <span className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0%] text-[#C7C7CC]">
            Export By Tokens
          </span>
        </div>
      ),
      onClick: () => handleExport("tokens"),
    },
    // {
    //   key: "divider2",
    //   label: <div className="h-[1px] bg-[#222] my-2" />,
    //   disabled: false,
    // },
    {
      key: "emails",
      label: (
        <div className="flex items-center  px-[18px] gap-[8px] py-4 rounded-lg hover:bg-[#111111] transition border border-b-[#e6e6ec] ">
          <img src={kresusAssets?.simpleEnvelope} alt="" />{" "}
          <span className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0%] text-[#C7C7CC]">
            Export By Email & Address
          </span>
        </div>
      ),
      onClick: () => handleExport("emails"),
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        style: { background: "transparent" }, // 👈 removes white default bg
        className:
          "!bg-transparent [&_.ant-dropdown-menu-item]:!bg-transparent [&_.ant-dropdown-menu-item:hover]:!bg-[#111111]",
      }}
      trigger={["hover"]}
      placement="bottomRight"
      dropdownRender={(menu) => (
        <div className="bg-[#000000] rounded-[16px] b-all p-4 w shadow-[-12px_12px_37px_0px_#4C377B1A,_-47px_47px_67px_0px_#4C377B17,_-106px_106px_90px_0px_#4C377B0D,_-188px_189px_107px_0px_#4C377B03,_-294px_295px_117px_0px_#4C377B00]">
          {menu}
        </div>
      )}
    >
      <div className=" px-[24px] h-[48px] rounded-[24px] bg-white flex gap-[10px] justify-center items-center text-[#000000]   cursor-pointer hover:bg-gray-100 transition">
        {loading ? (
          <Spin size="small" />
        ) : (
          <>
            <CiExport className="text-[20px]" />
            <p className="text-[16px] font-roboto font-medium">Export</p>
            <MdExpandMore className="text-[20px]" />
          </>
        )}
      </div>
    </Dropdown>
  );
};

export default ExportHolding;
