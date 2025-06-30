import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBook, faBookOpenReader, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons/faPeopleGroup";

export default function Navbar() {
  const location = useLocation();
  let navigate = useNavigate();
  let isLogin = localStorage.getItem("token");

  if (location.pathname === "/") {
    return <Outlet />;
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px", position: "fixed" }}>
        <h4 className="mb-4">
          <FontAwesomeIcon icon={faBookOpenReader} /> BukuBoo
        </h4>

        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link text-white">
              📊 Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/books" className="nav-link text-white">
              <FontAwesomeIcon icon={faBook} /> Books
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/members" className="nav-link text-white">
              <FontAwesomeIcon icon={faPeopleGroup} /> Members
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/denda" className="nav-link text-white">
              <FontAwesomeIcon icon={faMoneyBill} /> Denda
            </Link>
          </li>

          <li className="nav-item mt-3">
            <strong className="text-muted">Data</strong>
          </li>
          <li className="nav-item">
            <Link to="/lendings" className="nav-link text-white">Peminjaman</Link>
          </li>
          <li className="nav-item">
            <Link to="/lendings/data" className="nav-link text-white">Pengembalian</Link>
          </li>

          <li className="nav-item mt-4">
            <button
              className="btn btn-danger w-100"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}