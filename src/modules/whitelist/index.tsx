import React from "react";
import homePage from "../../../src/assets/allAssets/homePage.png";
import WhitelistTable from "./WhitelistTable";
import FooterAntD from "layout/footer";
import MenuAntD from "layout/menu";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
         <div className="static h-20 bg-[#000000] flex justify-between items-center px-4 sm:px-6 lg:px-10 shadow-sm">
            <MenuAntD />
          </div>
      {/* Main Content */}
      <div
        className="flex-grow w-full sm:py-8"
        style={{
          background: `linear-gradient(135deg, rgba(24, 71, 201, 0.9) 0%, rgba(11, 28, 84, 0.8) 25%, rgba(19, 71, 213, 0.7) 50%, rgba(14, 40, 96, 0.8) 75%, rgba(24, 79, 209, 0.9) 100%), url(${homePage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div
          className="bg-white mx-4 sm:mx-6 lg:mx-8"
          style={{
            background: `linear-gradient(135deg, rgba(24, 71, 201, 0.9) 0%, rgba(11, 28, 84, 0.8) 25%, rgba(19, 71, 213, 0.7) 50%, rgba(14, 40, 96, 0.8) 75%, rgba(24, 79, 209, 0.9) 100%), url(${homePage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="w-full">
            {/* Title Row */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-white relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-600 ">
                WaitList Users
              </h1>
            </div>
            {/* Content */}
            <div className=" pb-8 bg-white  rounded-xl ">
                <WhitelistTable />
            </div>
          </div>
        </div>
      </div>
      <FooterAntD />

    </div>
  );
};

export default Index;
