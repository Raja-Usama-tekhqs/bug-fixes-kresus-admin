/* eslint-disable @typescript-eslint/no-explicit-any */

import { Popover } from "antd";
const PopOver = ({
	content,
	title,
	placement = "topLeft",
	children,
	width,
}: any) => {
	return (
		<>
			<div className="truncate cursor-pointer">
				<Popover
					content={
						<span
							style={{
								color: "#131416",
							}}
							className="text-[14px] font-normal fontSora"
						>
							{content}
						</span>
					}
					title={
						title === "" ? (
							""
						) : (
							<span
								style={{
									color: "#000000",
								}}
								className="text-[16px]"
							>
								{title}
							</span>
						)
					}
					overlayStyle={{
						maxWidth: width,
					}}
					trigger="hover"
					placement={placement}
					className=" truncate"
					overlayClassName="truncate rounded-lg"
					overlayInnerStyle={{
						backgroundColor: "#edebe1",
						lineHeight: "1.5px",
						maxHeight: "300px",
						overflowY: "auto",
					}}
				>
					{children}
				</Popover>
			</div>
		</>
	);
};

export default PopOver;
