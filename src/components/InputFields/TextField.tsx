/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import React, { useState } from "react";
import "./style.css";
// Define the prop types for TextField
interface TextFieldProps {
  id: string;
  label?: string | JSX.Element;
  type: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  size?: SizeType;
  required?: boolean;
  error?: boolean;
  shrink?: boolean;
  errorMessage?: string;
  maxLength?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  name,
  value,
  disabled,
  onChange,
  onBlur,
  size,
  placeholder,
  required = true,
  shrink,
  error,
  type = 'text',
  maxLength,
  errorMessage,
  ...rest
}) => {
  const [_focused, setFocused] = useState<boolean>(false);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(value !== "");
    if (onBlur) onBlur(event);
  };

  const status = error ? "error" : undefined;
  return (
    <>
      <div>
        <label
          className={`${error ? "text-[#FF1F1F]" : "text-black"
            } font-medium text-[14px] `}
        >
          {label && <div>{label}<span className="text-[12px]">{required ? '*' : ''}</span></div>}
        </label>
        <div className="">
          <Input
            id={id}
            type={type}
            name={name}
            value={value}
            size={size}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            disabled={disabled}
            maxLength={maxLength}
            status={status}
            style={{
              // backgroundColor: focused ? "#fff7f5" : "white",
              borderRadius: "8px",
              caretColor: "#002a36f1",
              fontFamily: "Sora",
              boxShadow: "none",
              fontSize: "14px",
              fontWeight: 400,
              height: '38px'
              // color: "#B49C97",
            }}
            {...rest}
          />
        </div>
        {error && (
          <div className=" text-[10px] text-[#FF1F1F] mt-[3px] absolute">
            {errorMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default TextField;
