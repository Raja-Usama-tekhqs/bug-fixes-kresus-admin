import { Modal } from "antd";

type Props = {
  title: string;
  body: () => JSX.Element;
  onCancel: (val: boolean) => void;
  onSubmit: () => void;
  width?: number;
  okText?: string;
  cancelButtonProps?: object | undefined;
  okButtonProps?: object | undefined;
  footer?: React.ReactNode;
};

const ModalFooter = ({
  title,
  body,
  onCancel,
  onSubmit,
  width = 520,
  okText,
  footer,
}: Props) => (
  <Modal
    className="modal-form"
    title={title}
    open
    onCancel={() => onCancel(false)}
    footer={footer}
    centered
    width={width}
    closeIcon={null}
    onOk={() => onSubmit()}
    okText={okText}
    maskClosable={true}
  >
    {body()}
  </Modal>
);

export default ModalFooter;
