import React, { useState } from 'react';
import { Switch as AntDSwitch } from 'antd'; // Renaming the Ant Design Switch
import { useSelector } from 'react-redux';

const Switch = ({ checked, onChange }) => {
  const { themeMode, colorTheme } = useSelector((state) => state?.states);

  return (
    <>
      <AntDSwitch size="small" checked={checked} onChange={onChange} />
    </>
  );
};

export default Switch;
