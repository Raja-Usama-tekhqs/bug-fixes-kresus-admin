import { QRCode } from "antd";
import React from "react";
interface CustomQRCodeProps {
  text?: string;
  bgColor?: string;
  color?: string;
  size?: number;
}
const CustomQRCode: React.FC<CustomQRCodeProps> = ({
  text,
  bgColor,
  color,
  size,
}) => {
  return (
    <QRCode
      value={text || "-"}
      // style={{
      //   width: "300px",
      //   height: "300px",
      // }}
      size={size}
      color={color}
      bgColor={bgColor}
    />
  );
};

export default CustomQRCode;
