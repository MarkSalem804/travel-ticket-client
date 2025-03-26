/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";
import { Layout, Menu } from "antd";
import depedLogo from "../assets/deped_logo.png";
import Dingdong from "../assets/images.jpg";

const { Header, Content } = Layout;

const FormLayout = () => {
  return (
    <Layout>
      <Header
        style={{
          background: "#444545",
          color: "white",
          fontSize: "20px",
          display: "flex",
          alignItems: "center", // Vertically align logo & text
          paddingLeft: "30px", // Add some padding
        }}
      >
        {/* Logo */}
        <img
          src={depedLogo} // Update with your actual logo path
          alt="Logo"
          style={{
            height: "40px", // Adjust height as needed
            marginRight: "15px", // Space between logo & text
          }}
        />
        TRIP TICKETING SYSTEM
      </Header>
      <Content
        style={{
          padding: "20px",
          minHeight: "100vh",
          background: "#f5f5f5",
          backgroundImage: `url(${Dingdong})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default FormLayout;
