import React from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";

export default function Template() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Outlet />
            </div>
        </>
    )
}