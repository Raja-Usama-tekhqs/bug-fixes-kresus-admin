/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "antd";
const SecondaryButton = ({
	title,
	type,
	icon,
	className = "w-full !rounded-[6px] font-med text-[14px] h-[50px]",
	onClick,
	loading,
	disabled,
	...props
}: any) => {
	return (
		<div>
			<Button
				type="primary"
				icon={icon}
				htmlType={type}
				// style={buttonStyle}
				className={`${className} ${"text-white"} fontNumber no-shadow-button`}
				onClick={onClick}
				loading={loading}
				disabled={disabled}
				{...props}
			>
				{title}
			</Button>
		</div>
	);
};
export default SecondaryButton;
