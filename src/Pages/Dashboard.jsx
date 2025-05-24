import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../constant";
import { Link } from "react-router-dom";
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function Dashboard() {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get(API_URL + "/peminjaman", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((res) => {
                const lendings = res.data.data;

                const lendingPerMonth = lendings.reduce((acc, curr) => {
                    const date = new Date(curr.tgl_pinjam);
                    if (isNaN(date)) return acc;

                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    const key = `${year}-${month.toString().padStart(2, "0")}`;

                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {});

                const formatted = Object.entries(lendingPerMonth)
                    .sort(([a], [b]) => new Date(a) - new Date(b))
                    .map(([key, value]) => ({
                        name: key,
                        value
                    }));

                setChartData(formatted);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="container-fluid py-4 px-4" style={{ marginLeft: "150px" }}>
            <div className="text-center mb-5 px-4 py-5 bg-light rounded-3 shadow-sm">
                <h1 className="fw-bold display-5 mb-3">
                    <span className="text-primary">📚 BukuBoo</span>
                </h1>
                <h2 className="fw-normal mb-4">Perpustakaan Online</h2>
                <div className="mx-auto" style={{ maxWidth: "600px" }}>
                    <p className="text-muted mb-4">
                        <span className="text-primary fw-semibold">BukuBoo</span> siap mempermudah anda
                        dalam mengelola perpustakaan❤️
                    </p>
                    <Link to="/books" className="btn btn-primary btn-lg px-4">
                        Mulai
                    </Link>
                </div>
            </div>

            {/* grafik */}
            <div className="card shadow-sm border-0 p-4">
                <h3 className="mb-4 text-center">Statistik Peminjaman Bulanan</h3>
                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Memuat data...</p>
                    </div>
                ) : chartData.length > 0 ? (
                    <div style={{ width: "100%", height: "400px" }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#6c757d' }}
                                    axisLine={{ stroke: '#dee2e6' }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fill: '#6c757d' }}
                                    axisLine={{ stroke: '#dee2e6' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: '#fff',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="value"
                                    fill="#6366f1"
                                    name="Jumlah Peminjaman"
                                    radius={[4, 4, 0, 0]}
                                    activeBar={<Rectangle fill="#4f46e5" stroke="#4f46e5" />}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">Tidak ada data peminjaman yang tersedia</p>
                    </div>
                )}
            </div>
        </div>
    );
}