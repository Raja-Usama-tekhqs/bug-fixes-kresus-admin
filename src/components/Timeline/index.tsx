import { Timeline } from "antd";
import React from "react";

interface CustomTimelineProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
}

const CustomTimeline: React.FC<CustomTimelineProps> = ({ items }) => {
  return (
    <Timeline>
      {items?.map((item, index) => (
        <Timeline.Item key={index} className="fontMonospace">
          {item.children}
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default CustomTimeline;
