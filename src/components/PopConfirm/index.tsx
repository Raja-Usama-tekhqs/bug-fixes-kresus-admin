/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popconfirm } from 'antd';
import './style.less';

const PopConfirm = ({
  title,
  description,
  placement,
  icon,
  onClick,
  children,
}: {
  children: JSX.Element;
  onClick?: any;
  icon?: any;
  placement?: any;
  description?: any;
  title?: any
}) => {
  return (
    <>
      <div>
        <Popconfirm
          title={<span className="font-semiBold text-[13px]">{title}</span>}
          description={<span className="font-reg text-[12px]">{description}</span>}
          placement={placement}
          icon={icon}
          overlayInnerStyle={{
            backgroundColor: '#F7F7FA',
          }}
          overlayClassName={`${'light-theme'} custom-popover `}
          okButtonProps={{ className: 'custom-ok-button' }}
          cancelButtonProps={{ className: 'custom-cancel-button' }}
          onConfirm={onClick}
        //   onOpenChange={() => console.log('open change')}
        >
          {children}
        </Popconfirm>
      </div>
    </>
  );
};

export default PopConfirm;
