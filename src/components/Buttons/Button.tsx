/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "antd";
const ButtonAntD = ({
  title,
  type = 'primary',
  htmlType,
  icon,
  className,
  onClick,
  loading,
  iconPosition,
  disabled,
  size,
  ...props
}: any) => {
  return (
    <Button
      type={type}
      icon={icon}
      iconPosition={iconPosition}
      htmlType={htmlType}
      size={size}
      className={`${className} no-shadow-button fontNumber font-normal w-full h-[30px] sm:h-[40px]`}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      {...props}
    >
      {title}
    </Button>
  );
};
export default ButtonAntD;
