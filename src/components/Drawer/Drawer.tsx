import { CloseOutlined } from "@ant-design/icons";
import { DrawerProps as AntdDrawerProps, Drawer } from "antd";
import React from "react";

interface CustomDrawerProps
  extends Pick<AntdDrawerProps, "placement" | "width" | "extra"> {
  open: boolean;
  setOpen: (value: boolean) => void;
  title?: string;
  height?: string | number;
  children: React.ReactNode;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  setOpen,
  title = "Drawer",
  placement = "right",
  width = '350px',
  height,
  extra,
  children,
}) => {
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      title={
        <span className=" text-[#101828] text-[18px]">{title}</span>
      }
      onClose={onClose}
      open={open}
      width={width}
      style={{
        borderRadius: "0px 0px 0px 0px",
        backgroundColor: "#ffffff",
        // maxWidth: 1024,
        margin: 'auto'

      }}
      height={height}
      placement={placement}
      extra={extra}
      closeIcon={<CloseOutlined style={{ color: "#101828", fontSize: "18px" }} />}
    >
      {children}
      <style>{`
        .ant-drawer .ant-drawer-header {
          background: #ffffff !important;
          padding: 16px;
          border-bottom: 1px solid #F2F2F2;
          position: relative;
        }

        .ant-drawer-header .ant-drawer-title {
          font-size: 18px;
          font-weight: bold;
        }

        .ant-drawer .ant-drawer-header {
          text-align: start;
        }
          .ant-drawer-close{
          position: absolute;
          right: 5px;
          }

      `}</style>
    </Drawer>
  );
};

export default CustomDrawer;
