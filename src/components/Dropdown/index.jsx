import { Dropdown as DropdownAntD, theme } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import './index.css';

const { useToken } = theme;
const Dropdown = ({ children, items = [], placement = 'bottomRight' }) => {
  const { themeMode } = useSelector((state) => state?.states);
  const { token } = useToken();
  const menuStyle = {
    boxShadow: 'none',
    display: 'flex',
    backgroundColor: themeMode === 'light' ? '' : '#121212',
  };
  const contentStyle = {
    backgroundColor: themeMode === 'light' ? token.colorBgElevated : '#1f1f1f',
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  return (
    <DropdownAntD
      trigger={['click']}
      menu={{
        items,
      }}
      overlayClassName={`action-dropdown ${
        themeMode === 'light' ? 'action-dropdown-light' : 'action-dropdown-dark'
      }`}
      placement={placement}
      arrow={{
        pointAtCenter: true,
      }}
      dropdownRender={(menu) => (
        <div style={contentStyle}>
          {React.cloneElement(menu, {
            style: menuStyle,
          })}
        </div>
      )}
    >
      {children}
    </DropdownAntD>
  );
};
export default Dropdown;
