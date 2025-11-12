import { Modal } from 'antd';
import { IoClose } from "react-icons/io5";

type Props = {
  title: string;
  body: () => JSX.Element;
  onCancel: (val: boolean) => void;
  onSubmit: () => void;
  width?: number;
  okText?: string;
  cancelButtonProps?: object | undefined;
  okButtonProps?: object | undefined;
  closeIcon?: JSX.Element;
  maskClosable?: boolean,

};

const ModelGeneric = ({
  title, body, onCancel, onSubmit, width = 520, okText,
  closeIcon = <IoClose color='#667085' size={20} />,
  maskClosable
}: Props) => (
  <Modal
    className="modal-generic"
    title={title}
    open
    onCancel={() => onCancel(false)}
    footer={null}
    centered
    width={width}
    maskClosable={maskClosable}
    closeIcon={
      closeIcon
    }
    onOk={() => onSubmit()}
    okText={okText}>
    {body()}
  </Modal>
);

export default ModelGeneric;
