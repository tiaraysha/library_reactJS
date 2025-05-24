import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivatePage() {
    let authentication = localStorage.getItem("token");

    // jika navigate disimpan di function, harus gunakan useNavigate(), jika digunakan di konten HTML gunakan <Navigate />
    // outlet --> element children lainnya
    // return nya gapake kurung bulat () karena ga memanggil tag html
    return authentication ? <Outlet /> : <Navigate to="/" replace />
}