import React from "react";
import { Layout } from "antd";

const SideBar = ({ menu }) => {
  return (
    <Layout.Sider
      className="sidebar"
      breakpoint={"lg"}
      theme="light"
      collapsedWidth={0}
      trigger={null}
      width={300}
    >
      {menu}
    </Layout.Sider>
  );
};

export default SideBar;
