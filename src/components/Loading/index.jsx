import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loading = ({ size }) => {
  return (
    <>
      <Spin size={size} />
      {/* For changing the icon
      <Spin indicator={<LoadingOutlined spin />} size={size} /> */}
    </>
  );
};
export default Loading;
