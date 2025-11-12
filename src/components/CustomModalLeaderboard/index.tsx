import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";

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
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title=""
        className="custom-modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={width}
        mask={true}
        height={height}
        footer={null}
        closeIcon={
          <CloseOutlined style={{ color: "white", fontSize: "20px" }} />
        }
        maskStyle={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {children}
      </Modal>
    </>
  );
};

export default CustomModal;
