import React, { useState } from "react";
import { Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

interface OptionType {
  label: string;
  value: string;
}

interface SelectFieldProps {
  id: string;
  label?: string;
  name: string;
  value?: string | string[];
  disabled?: boolean;
  onChange: (value: string | string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  options: OptionType[];
  mode?: "multiple" | "tags";
  showSearch?: boolean;
  allowClear?: boolean;
  loading?: boolean;
  className?: string;
  labelClassName?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  // name,
  value,
  disabled = false,
  onChange,
  onBlur,
  placeholder = "Please Select",
  required = false,
  error = false,
  errorMessage,
  options,
  mode,
  showSearch = false,
  allowClear = false,
  loading = false,
  className = "",
  labelClassName = "",
}) => {
  interface RootState {
    states: {
      themeMode: string;
      colorTheme: string;
    };
  }

  const { themeMode, colorTheme} = useSelector(
    (state: RootState) => state.states || {}
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`text-[14px] font-semibold mb-1 block ${labelClassName}`}
          style={{ color: themeMode === "light" ? "#000000" : "#9F9B93" }}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="!border !border-red-800 rounded-md">
        <Select
          id={id}
          // name={name}
          value={value}
          mode={mode}
          showSearch={showSearch}
          allowClear={allowClear}
          loading={loading}
          placeholder={placeholder}
          disabled={disabled}
          optionFilterProp="label"
          onChange={(val) => onChange(val)}
          onBlur={onBlur}
          open={dropdownOpen}
          onDropdownVisibleChange={(open) => setDropdownOpen(open)}
          suffixIcon={
            <DownOutlined
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                color: themeMode === "light" ? colorTheme : "#939BC9",
                cursor: "pointer",
              }}
            />
          }
          className={`!w-full !rounded-md !border !border-red-800 !font-normal !text-black ${className}`}
          status={error ? "error" : ""}
          options={options}
        />
      </div>

      {error && errorMessage && (
        <div className="text-sm text-red-500 mt-1">{errorMessage}</div>
      )}
    </div>
  );
};

export default SelectField;
