import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import axios from "axios";
import Modal from "../../Components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";

export default function Denda() {

    const [denda, setDenda] = useState([]);
    const [error, setError] = useState([]);
    // const [filterDenda, setFilterDenda] = useState("Semua");
    // const filteredDenda = denda.filter((denda) => {
    //     if(filterDenda === "Semua") return true;
    //     return denda.jenis_denda === filterDenda;
    // })

    const [member, setMember] = useState([]);
    const [isDetailMember, setIsDetailMember] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const totalPages = Math.ceil(denda.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLendings = denda.slice(indexOfFirstItem, indexOfLastItem);

    const navigate = useNavigate();

    function fetchData() {
        axios.get(API_URL + "/denda", {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })

            .then((res) => setDenda(res.data.data))
            .catch((err) => {
                if (err.status == 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
                setError(err.response.data);
            })
    }

    function detailMember(id) {
        axios.get(API_URL + '/denda/' + id, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                setMember(res.data.data);
                setIsDetailMember(true);
            })
            .catch((err) => {
                if (err.status == 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
                setError(err.response.data);
            });
    }

    // useEffect(() => {
    //     setCurrentPage(1);
    // }, []);

    useEffect(() => {
        setCurrentPage(1);
        fetchData();
    }, []);

    return (
        <>
            <div className="container-fluid" style={{ marginLeft: "150px", padding: "20px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">
                        <FontAwesomeIcon icon={faMoneyBill} className="text-warning me-2" />
                        Daftar Denda
                    </h2>
                </div>

                <div className="card shadow-sm border-0 overflow-hidden">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="bg-amber-50">
                                    <tr>
                                        <th style={{ width: '5%' }} className="ps-4">#</th>
                                        <th style={{ width: '15%' }}>ID Member</th>
                                        <th style={{ width: '10%' }}>ID Buku</th>
                                        <th style={{ width: '15%' }}>Jenis Denda
                                            {/* <select value={filterDenda} onChange={(e) => setFilterDenda(e.target.value)} className="form-select form-select-sm">
                                                <option value="Semua">Semua</option>
                                                <option value="kerusakan">Kerusakan</option>
                                                <option value="terlambat">Terlambat</option>
                                                <option value="lainnya">Lainnya</option>
                                            </select> */}
                                        </th>
                                        <th style={{ width: '40%' }}>Deskripsi</th>
                                        <th style={{ width: '15%' }}>Total Denda</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {denda.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                Tidak ada data denda
                                            </td>
                                        </tr>
                                    ) : (
                                        currentLendings.map((value, index) => (
                                            <tr key={value.id} className="align-middle">
                                                <td className="ps-4">{index + 1}</td>
                                                <td>
                                                    <span
                                                        className="text-primary cursor-pointer text-decoration-underline"
                                                        onClick={() => detailMember(value.id_member)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {value.id_member}
                                                    </span>
                                                </td>
                                                <td>{value.id_buku}</td>
                                                <td>
                                                    {value.jenis_denda}
                                                </td>
                                                <td className="text-truncate" style={{ maxWidth: '300px' }} title={value.deskripsi}>
                                                    {value.deskripsi}
                                                </td>
                                                <td className="fw-semibold text-danger">
                                                    {new Intl.NumberFormat('id-ID', {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                        maximumFractionDigits: 0
                                                    }).format(value.jumlah_denda).replace('IDR', 'Rp')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i} className="page-item">
                                    <button
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`page-link ${currentPage === i + 1 ? "active" : ""}`}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/*Detail Modal */}
                <Modal
                    isOpen={isDetailMember}
                    onClose={() => setIsDetailMember(false)}
                    title="Detail Denda Member"
                >
                    <div className="p-4">
                        {member.map((item, index) => (
                            <div
                                key={index}
                                className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-100"
                            >
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">ID Peminjaman:</span>
                                    <span className="fw-semibold">{item.id}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">ID Buku:</span>
                                    <span className="fw-semibold">{item.id_buku}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Jumlah Denda:</span>
                                    <span className="fw-semibold text-danger">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR'
                                        }).format(item.jumlah_denda).replace('IDR', 'Rp')}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setIsDetailMember(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}