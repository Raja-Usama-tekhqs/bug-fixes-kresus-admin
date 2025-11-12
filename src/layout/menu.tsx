import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Tabs, TabsProps } from "antd";
import { kresusAssets } from "assets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const MenuAntD = () => {
  const [current, setCurrent] = useState(location.pathname || "/dashboard");
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "profile") {
      navigate("/dashboard");
    } else if (key === "logout") {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }
  };

  const onTabChange = (key: string) => {
    setCurrent(key);
    navigate(key);
  };

  // Main tab items for larger screens
  const mainTabItems: TabsProps["items"] = [
    {
      key: "/dashboard",
      label: (
        <span className="rounded-[24px] text-white font-semibold transition-all">
          Dashboard
        </span>
      ),
    },
    {
      key: "/tokens",
      label: <span className="rounded-[24px] text-white">Tokens</span>,
    },
    {
      key: "/whitelist",
      label: <span className="rounded-[24px] text-white">WaitList</span>,
    },
  ];



  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        My Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className="  bg-[#000000] h-[80px] flex justify-between items-center  px-[20px] sm:px-[120px] ">
        <div className="flex items-center">
          <img src={kresusAssets.KresusLogo} alt="Bryt Logo" height={30} />
        </div>

        <div className="flex !items-center justify-between gap-2 sm:gap-4 ">
          <div className="flex items-center max-h-[40px]">
            <Tabs
              activeKey={current}
              onChange={onTabChange}
              items={mainTabItems}
              className="custom-header-tabs"
              tabBarStyle={{
                background: "#000000",
                borderRadius: "24px",
              }}
            />
          </div>

          <div className="flex gap-5 items-center rounded-[24px] max-h-[40px] ">
            <Dropdown overlay={menu} trigger={["click"]}>
              <Avatar
                src={kresusAssets.Avatar}
                size={40}
                className="cursor-pointer "
              />
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuAntD;
