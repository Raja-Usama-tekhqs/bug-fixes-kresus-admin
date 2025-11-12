/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover } from 'antd';
import './infoPopOver.less';

const InfoPopover = ({
  children,
  title = '',
  trigger = 'hover',
  content = '',
}: any) => (
  <Popover
    overlayStyle={{
      maxWidth: 200,
    }}
    overlayClassName="infoPopover"
    overlayInnerStyle={{
      backgroundColor: "#edebe1",
      lineHeight: "normal",
    }}
    content={content}
    title={title}
    trigger={trigger}
  >
    {children}
  </Popover>
);

export default InfoPopover;
