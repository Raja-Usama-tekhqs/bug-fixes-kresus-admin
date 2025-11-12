import { kresusAssets } from "assets";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import homePage from "../../assets/allAssets/homePage.png";


const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      if (values.email === "admin@kresus.com" && values.password === "1234") {
        navigate("/dashboard");
      } else {
        message.error("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Navigation failed", err);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-background min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
      {/* Animated Bubbles */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>

      {/* Animated Shapes */}
      <div className="shape"></div>
      <div className="shape"></div>


      {/* Logo */}
      <img
        src={kresusAssets.KresusLogo2}
        alt="Kresus Logo"
        className="h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-76 lg:w-76 mb-4  md:mb-12  relative z-10 animate-pulse"
      />

      {/* Login Box */}
      <div className="p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-[80%] lg:w-[80%] sm:w-[85%] md:w-full max-w-sm relative z-10" style={{
        background: `linear-gradient(135deg, rgba(4, 10, 26, 0.9) 0%, rgba(6, 11, 28, 0.8) 25%, rgba(3, 12, 38, 0.7) 50%, rgba(5, 10, 20, 0.8) 75%, rgba(5, 19, 53, 0.9) 100%), url(${homePage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-white">
          Welcome to Kresus Analytics
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          size="large"
          className="w-full"
        >
          <Form.Item
            label={<span className="text-xs text-white sm:text-sm md:text-base">Email*</span>}
            name="email"
            className="mb-2 sm:mb-3 md:mb-4"
            rules={[{ message: 'Please input your email!' }]}
          >
            <Input
              placeholder="Please enter your email"
              className="h-8 sm:h-10 md:h-12 text-xs sm:text-sm md:text-base transition-all duration-300 hover:shadow-md border !text-black border-black focus:border-[#030A74]"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs sm:text-sm md:text-base text-white">Password*</span>}
            name="password"
            className="mb-3 sm:mb-4 md:mb-6"
            rules={[{ message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Please enter your password"
              className="h-8 sm:h-10 md:h-12 text-xs sm:text-sm md:text-base transition-all duration-300 hover:shadow-md border border-black focus:border-[#030A74]"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full h-8 sm:h-10 md:h-12 !text-white text-xs sm:text-sm md:text-base !bg-[#051270] hover:bg-[#1a237e] transition-all duration-300 hover:shadow-lg"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Auth;
