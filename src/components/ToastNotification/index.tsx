import { CheckOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { MdErrorOutline } from "react-icons/md";
type ToastType = "success" | "error";

const ToastNotification = (type: ToastType, message: string): void => {
  const getIcon = () => {
    if (type === "success") {
      return <CheckOutlined />
    } if (type === 'error') {
      return <MdErrorOutline />
    } else {
      return <CheckOutlined />
    }
  }
  const notify = () => {
    const toastId = toast.custom(
      () => (
        <div className="bg-[#002a36] rounded-[10px] py-[10px] px-[10px] flex items-center space-x-[10px]">
          <div className="flex items-center justify-center bg-[#FFFFFF] rounded-[5px] p-[10px]">
            {getIcon()}
          </div>
          <div className="text-[#FFFFFF] text-[14px] font-bold fontMonospace">
            {message}
          </div>
        </div>
      ),
      {
        duration: 2000, // Prevent auto-dismiss
        position: "top-center",
      }
    );

    // Automatically unmount the toast after 1 second
    setTimeout(() => toast.dismiss(toastId), 2000);
  };

  notify();
};

export default ToastNotification;
