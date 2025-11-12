import React from 'react';
import { Checkbox as AntCheckbox } from 'antd'; // Renamed the imported Checkbox component
import { useSelector } from 'react-redux';

const Checkbox = ({
  title,
  id,
  name,
  className = '',
  checked,
  onChange,
  error,
  errorMessage,
}) => {
  const { themeMode, colorTheme } = useSelector((state) => state?.states);
  return (
    <>
      <div>
        <AntCheckbox
          id={id}
          name={name}
          onChange={onChange}
          checked={checked}
          className={`${className} ${
            themeMode === 'light' ? '' : 'dark-checkbox'
          }`}
        >
          <span
            className={` text-[12px] font-med whitespace-nowrap`}
            style={{
              color: themeMode === 'light' ? '#000000' : '#9F9B93',
            }}
          >
            {title}
          </span>
        </AntCheckbox>
      </div>
      {error ? (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      ) : null}
    </>
  );
};

export default Checkbox;
