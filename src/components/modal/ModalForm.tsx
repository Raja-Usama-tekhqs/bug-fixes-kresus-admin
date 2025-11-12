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
  maskClosable?: boolean;
};

const ModalForm = ({
  title,
  body,
  onCancel,
  onSubmit,
  width = 520,
  okText,
  maskClosable = true,
}: Props) => (
  <Modal
    className="modal-form"
    title={title}
    open
    onCancel={() => onCancel(false)}
    footer={null}
    centered
    width={width}
    closeIcon={null}
    onOk={() => onSubmit()}
    okText={okText}
    maskClosable={maskClosable}
  >
    {body()}
  </Modal>
);

export default ModalForm;
