import { CloseOutlined } from '@ant-design/icons';
import { ButtonProps, Modal } from 'antd';

type ConfirmModalProps = {
    open: boolean;
    title?: string | JSX.Element;
    okText?: string;
    cancelText?: string;
    onCancel?: () => void;
    onOk?: () => void;
    body?: JSX.Element;
    icon?: JSX.Element;
    closeIcon?: JSX.Element;
    okButtonProps?: ButtonProps | undefined;
    cancelButtonProps?: ButtonProps | undefined;
    maskClosable?: boolean
};

const ConfirmModal = ({ open, title, okText, cancelText, onCancel, onOk, body, icon, closeIcon = <CloseOutlined style={{ color: '#667085' }} />, okButtonProps, cancelButtonProps, maskClosable = false }: ConfirmModalProps) => {
    return (
        <Modal
            title={<span className='flex items-center gap-2 text-[18px] font-semibold'>{icon} {title}</span>}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            okText={okText}
            cancelText={cancelText}
            closeIcon={closeIcon}
            maskClosable={maskClosable}
            okButtonProps={okButtonProps}
            cancelButtonProps={
                cancelButtonProps}
        >
            <div className={`text-[14px] ${icon ? 'ml-[66px] -mt-[36px]' : "-mt-[18px]"}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                {body}
            </div>
        </Modal >
    );
};

export default ConfirmModal;
