/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */

import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import React from "react";
import "./style.css";
// Define the prop types for TextField
interface TextFieldProps {
	id: string;
	label?: string;
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

const TextField: React.FC<TextFieldProps> = ({
	id,
	label,
	type,
	name,
	value,
	onChange,
	onBlur,
	size,
	placeholder,
	required = true,
	error,
	errorMessage,
	...rest
}) => {
	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (onBlur) onBlur(event);
	};
	const status = error ? "error" : undefined;
	const [focused, setFocused] = React.useState(false);

	return (
		<>
			<div>
				<label
					className={`${error ? "text-[#FF1F1F]" : "text-[#344054]"
						} font-medium text-[14px] `}
				>
					{label && <div>{label}<span className="text-[12px]">{required ? '*' : ''}</span></div>}
				</label>
				<div className={``}>
					<Input.Password
						id={id}
						type={type}
						name={name}
						value={value}
						size={size}
						placeholder={placeholder}
						onChange={onChange}
						onFocus={() => setFocused(true)}
						onBlur={handleBlur}
						status={status}
						iconRender={(visible) =>
							visible ? (
								<EyeOutlined
									style={{
										color: "#002a36f1",
									}}
								/>
							) : (
								<EyeInvisibleOutlined
									style={{
										color: "#002a36f1",
									}}
								/>
							)
						}
						style={{
							// backgroundColor: focused ? "#fff7f5" : "transparent",
							borderRadius: "8px",
							backgroundColor: focused ? "#fff7f5" : "transparent",
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
