import React, { useState } from 'react';
import { Popconfirm, Checkbox as AntCheckbox } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const CheckboxWithConfirm = ({ checked, initialChecked }) => {
  const [checkbox, setCheckbox] = useState(initialChecked);
  const handleCheckboxChange = (e) => {
    e.stopPropagation();
  };
  const handleConfirm = () => {
    setCheckbox((prev) => !prev);
  };
  return (
    <Popconfirm
      title={<span className="font-bold">Confirm Action</span>}
      description={
        <span className="font-reg">
          Are you sure you want to {checked ? 'deactivate' : 'activate'} this
          item?
        </span>
      }
      placement="top"
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      onConfirm={handleConfirm}
    >
      <AntCheckbox checked={checkbox} onChange={handleCheckboxChange} />
    </Popconfirm>
  );
};

export default CheckboxWithConfirm;
