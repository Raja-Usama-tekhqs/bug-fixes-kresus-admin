import React from "react";
import FooterAntD from "layout/footer";
import MenuAntD from "layout/menu";
import WaitlistTable from "./WaitlistTable";

const Index: React.FC = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col ">
        <MenuAntD />

        <div className="flex-1 flex flex-col px-[10px] sm:px-[20px] md:px-[40px] lg:px-[120px]">
          {/* Main Content */}
          <div className="my-14">
            <h1 className="font-roboto font-medium text-[20px] sm:text-[32px] leading-[100%] tracking-[0] align-middle text-[#FFFFFF]">
              WaitList Users
            </h1>
          </div>

          {/* Content */}
          <div className=" pb-8 py-4 rounded-xl ">
            <WaitlistTable />
          </div>
        </div>
      </div>
      <FooterAntD />
    </>
  );
};

export default Index;
