import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/setvlogo.jpeg"; // Adjust the path as needed
import { Button } from "@/components/ui/button"; // ShadCN UI Button Component
import SideBar from "@/components/kunal_components/SideBar"; // Import the new Sidebar

const Dashboard = () => {
  const location = useLocation();

  // Helper function to check if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar from kunal_components */}
      <SideBar />
    </div>
  );
};

export default Dashboard;
