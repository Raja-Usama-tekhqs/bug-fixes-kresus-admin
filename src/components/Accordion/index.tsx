import React from "react";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";

const Accordion: React.FC<CollapseProps> = (props) => {
  return <Collapse {...props} className="fontMonospace" />;
};

export default Accordion;
