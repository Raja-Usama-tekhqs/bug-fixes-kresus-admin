import React from 'react';
import { Tooltip as ToolTip } from 'antd';

const Tooltip = ({ placement, title, children }) => {
  return (
    <>
      <ToolTip
        placement={placement}
        title={title}
        overlayClassName=""
        overlayInnerStyle={{
          fontSize: '12px',
          fontFamily: 'inter-reg',
        }}
      >
        {children}
      </ToolTip>
    </>
  );
};

export default Tooltip;
