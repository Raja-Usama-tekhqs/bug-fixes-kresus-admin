import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";

interface CustomModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  width?: number;
  height?: number;
  children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  width,
  height,
  children,
}) => {
  const [fontSize, setFontSize] = useState<string>("30px");
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth <= 768 ? "20px" : "30px");
    };

    handleResize(); // Set initial font size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={width}
        height={height}
        footer={null}
        closeIcon={
          <CloseOutlined style={{ fontSize: fontSize, color: "#505050" }} />
        }
      >
        {children}
      </Modal>
    </>
  );
};

export default CustomModal;
