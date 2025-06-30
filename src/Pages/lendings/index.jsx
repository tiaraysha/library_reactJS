import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import Modal from "../../Components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

export default function Lendings() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState([]);

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({
        id_buku: "",
        id_member: "",
        tgl_pinjam: "",
        tgl_pengembalian: ""
    })

    const [alert, setAlert] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        axios.get(API_URL + "/buku", {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}` // jika menggunakan token
            }
        })

            .then(res => {
                setBooks(res.data);
            })

            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
                setError(err.response.data)
            });
    }

    function handleBtn(booksId) {
        setFormModal({ ...formModal, id_buku: booksId });
        setIsModalOpen(true);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        axios.post(API_URL + "/peminjaman", formModal, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })

            .then(res => {
                setIsModalOpen(false);
                setAlert("Sukses menambah peminjaman baru!");
                // yg ditambah tuh ini
                setBooks(prevBooks =>
                    prevBooks.map(book =>
                        book.id === formModal.id_buku
                            ? { ...book, stok: book.stok - 1 }
                            : book
                    )
                );

                setFormModal({ id_buku: "", id_member: "", tgl_pinjam: "", tgl_pengembalian: "" });
            })

            .catch(err => {
                if (err.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
                setError(err.response.data);
            })
    }

    return (
        <>
            <div className="container-fluid" style={{ marginLeft: "150px", padding: "20px" }}>
                {alert && (
                    <div className="alert alert-success alert-dismissible fade show mb-4">
                        {alert}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setAlert("")}
                        />
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="mb-0">
                        <span className="text-primary">📚</span> Daftar Buku
                    </h2>
                </div>

                {books.length === 0 ? (
                    <div className="alert alert-info text-center">
                        Tidak ada buku tersedia
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {books.map((item) => (
                            <div className="col" key={item.id}>
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="card-body d-flex flex-column">
                                        <div className="mb-3">
                                            <h5 className="card-title fw-bold text-primary">
                                                {item.judul}
                                            </h5>
                                            <div className="d-flex justify-content-between text-muted small">
                                                <span>No. Rak: {item.no_rak}</span>
                                                <span>Stok: {item.stok}</span>
                                            </div>
                                        </div>
                                        <button
                                            className={`btn mt-auto ${item.stok > 0 ? 'btn-primary' : 'btn-outline-secondary'}`}
                                            disabled={item.stok <= 0}
                                            onClick={() => handleBtn(item.id)}
                                        >
                                            {item.stok > 0 ? (
                                                <>
                                                    <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                                                    Pinjam Buku
                                                </>
                                            ) : (
                                                'Stok Habis'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Form Peminjaman"
                >
                    {Object.keys(error).length > 0 && (
                        <div className="alert alert-danger mb-4">
                            <ul className="mb-0">
                                {error?.data ? (
                                    Object.entries(error.data).map(([key, value]) => (
                                        <li key={key}>{value}</li>
                                    ))
                                ) : (
                                    <li>{error.message || "Terjadi kesalahan."}</li>
                                )}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                ID Buku <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={formModal.id_buku}
                                onChange={(e) => setFormModal({ ...formModal, id_buku: e.target.value })}
                                readOnly
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                ID Member <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={formModal.id_member}
                                className="form-control"
                                onChange={(e) => setFormModal({ ...formModal, id_member: e.target.value })}
                                required
                            />
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Tanggal Pinjam <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formModal.tgl_pinjam}
                                        onChange={(e) => setFormModal({ ...formModal, tgl_pinjam: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Tanggal Pengembalian <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formModal.tgl_pengembalian}
                                        onChange={(e) => setFormModal({ ...formModal, tgl_pengembalian: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                            >
                                Proses
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </>
    );
}