import React from "react";
import "./styles.css";

interface OverviewProps {
    activeTab: string;
}

const Overview: React.FC<OverviewProps> = ({activeTab}) => {
    console.log(activeTab)
    return (
        <div className="min-h-screen ">
          <p className="text-[32px] text-white font-medium text-center mt-40">
            Coming Soon...!
          </p>
        </div>
    );
};

export { Overview as default };


