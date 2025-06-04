import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constant";

export default function Login() {
    const [login, setLogin] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState([]);

    let navigate = useNavigate();

    function loginProcess(e) {
        e.preventDefault();
        axios.post(API_URL + '/login', login)
            .then(res => {
                localStorage.setItem("token", res.data.token);
                navigate("/dashboard");

            }).catch(err => {
                setError(err.response.data);
            })
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <form
                className="card shadow-sm rounded-lg mx-auto p-4"
                style={{ width: "100%", maxWidth: "400px" }}
                onSubmit={loginProcess}
            >
                <div className="card-header bg-transparent border-0 text-center py-3">
                    <h2 className="fw-bold text-primary">
                        <span className="text-dark">Buku</span>Boo
                    </h2>
                    <p className="text-muted mb-0">Welcome Back</p>
                    <p className="text-muted small">Please login to your account</p>
                </div>

                {/* Error messages */}
                {Object.keys(error).length > 0 && (
                    <div className="alert alert-danger rounded">
                        {Object.entries(error.data).length > 0 ? (
                            <ul className="mb-0">
                                {Object.entries(error.data).map(([key, value]) => (
                                    <li key={key}>{value}</li>
                                ))}
                            </ul>
                        ) : (
                            error.message
                        )}
                    </div>
                )}

                <div className="card-body pt-1 pb-3">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-muted small mb-1" id="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="form-control py-2"
                            id="email"
                            placeholder="name@example.com"
                            onChange={(e) => setLogin({ ...login, email: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label text-muted small mb-1" id="password">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control py-2"
                            id="password"
                            placeholder="••••••••"
                            onChange={(e) => setLogin({ ...login, password: e.target.value })}
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100 py-2 fw-semibold rounded"
                        type="submit"
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
}