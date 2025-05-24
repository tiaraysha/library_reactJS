import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import Modal from "../../Components/Modal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faPen, faPlus, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";

export default function BookIndex() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({ no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: '' });
    const [alert, setAlert] = useState("");

    const [selectedBook, setSelectedBook] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [detailBook, setDetailBook] = useState({});
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const navigate = useNavigate();

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

            .then(res => setBooks(res.data))
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
                setError(err.response.data)
            });
    }


    function handleSubmitModal(e) {
        e.preventDefault();
        axios.post(API_URL + "/buku", formModal, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(() => {
                setIsModalOpen(false);
                setAlert("Sukses menambah buku baru!");
                setFormModal({ no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: '' });
                setError([]);
                fetchData();
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
                setError(err.response.data)
            });
    }

    function handleEditSubmit(e) {
        e.preventDefault();
        axios.put(`${API_URL}/buku/${selectedBook.id}`, formModal, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(() => {
                setIsEditModalOpen(false);
                setSelectedBook(null);
                setAlert("Berhasil merubah data buku!");
                setFormModal({ no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: '' });
                setError([]);
                fetchData();
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
                setError(err.response.data)
            });
    }



    function handleDelete() {
        axios.delete(`${API_URL}/buku/${selectedBook.id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(() => {
                setIsDeleteModalOpen(false);
                setSelectedBook(null);
                setAlert("Berhasil menghapus buku!");
                setError([]);
                fetchData();
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
                setError(err.response.data)
            });
    }

    function handleBtnDetail(books) {
        setDetailBook(books);
        setIsDetailModalOpen(true);
    }

    return (
        <>
            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-success mt-3" onClick={() => {
                    setIsModalOpen(true);
                    setFormModal({ no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: '' });
                    setError([]);
                }}><FontAwesomeIcon icon={faPlus} /> Buku</button>
            </div>
            <h1 className="d-flex flex-wrap" style={{ marginLeft: "250px", padding: "20px" }}>Daftar Buku📚</h1>
            <div className="d-flex flex-wrap" style={{ marginLeft: "250px", padding: "20px" }}>
                {books.map((value, index) => (
                    <div
                        key={value.id}
                        className="card m-3 shadow"
                        style={{ width: "18rem", borderRadius: "15px" }}
                    >
                        <div className="card-body">
                            <h5 className="card-title fw-bold">{value.judul}</h5>
                            <h6 className="card-subtitle mb-2 text-muted"><FontAwesomeIcon icon={faUser} /> {value.pengarang}</h6>
                            <p className="card-text mb-1"><strong>Penerbit:</strong> {value.penerbit}</p>
                            <p className="card-text mb-1"><strong>Stok:</strong> {value.stok}</p>
                            <p className="card-text mb-1"><strong>No Rak:</strong> {value.no_rak}</p>
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-outline-info btn-sm" onClick={() => {
                                    setSelectedBook(value);
                                    setFormModal({ no_rak: value.no_rak, judul: value.judul, pengarang: value.pengarang, tahun_terbit: value.tahun_terbit, penerbit: value.penerbit, stok: value.stok, detail: value.detail });
                                    setIsEditModalOpen(true);
                                    setError([]);
                                }}>
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button className="btn btn-outline-danger btn-sm mx-2" onClick={() => {
                                    setSelectedBook(value);
                                    setIsDeleteModalOpen(true);
                                    setError([]);
                                }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button className="btn btn-outline-primary btn-sm" onClick={() => {
                                    handleBtnDetail(value);
                                    setError([]);
                                }}>
                                    <FontAwesomeIcon icon={faInfo} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Buku Baru">
                <form onSubmit={handleSubmitModal}>
                    {Object.keys(error).length > 0 && (
                        <div className="alert alert-danger mb-4">
                            {error?.data && Object.entries(error.data).length > 0
                                ? (
                                    <ul className="mb-0">
                                        {Object.entries(error.data).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))}
                                    </ul>
                                )
                                : <div>{error.message || "Terjadi kesalahan."}</div>
                            }
                        </div>
                    )}

                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label fw-bold">No Rak <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formModal.no_rak}
                                    onChange={(e) => setFormModal({ ...formModal, no_rak: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Judul Buku <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formModal.judul}
                                    onChange={(e) => setFormModal({ ...formModal, judul: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Pengarang <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formModal.pengarang}
                                    onChange={(e) => setFormModal({ ...formModal, pengarang: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Tahun Terbit <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formModal.tahun_terbit}
                                    onChange={(e) => setFormModal({ ...formModal, tahun_terbit: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Penerbit <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formModal.penerbit}
                                    onChange={(e) => setFormModal({ ...formModal, penerbit: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Stok <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formModal.stok}
                                    onChange={(e) => setFormModal({ ...formModal, stok: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Detail <span className="text-danger">*</span></label>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                    value={formModal.detail}
                                    onChange={(e) => setFormModal({ ...formModal, detail: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4 gap-2">
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
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Buku">
                <form onSubmit={handleEditSubmit}>
                    {Object.keys(error).length > 0 && (
                        <div className="alert alert-danger mb-4">
                            {error?.data && Object.entries(error.data).length > 0
                                ? (
                                    <ul className="mb-0">
                                        {Object.entries(error.data).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))}
                                    </ul>
                                )
                                : <div>{error.message || "Terjadi kesalahan."}</div>
                            }
                        </div>
                    )}

                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label fw-bold">No Rak <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formModal.no_rak}
                                    onChange={(e) => setFormModal({ ...formModal, no_rak: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Judul Buku <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formModal.judul}
                                    onChange={(e) => setFormModal({ ...formModal, judul: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Pengarang <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formModal.pengarang}
                                    onChange={(e) => setFormModal({ ...formModal, pengarang: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Tahun Terbit <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formModal.tahun_terbit}
                                    onChange={(e) => setFormModal({ ...formModal, tahun_terbit: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Penerbit <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formModal.penerbit}
                                    onChange={(e) => setFormModal({ ...formModal, penerbit: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Stok <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formModal.stok}
                                    onChange={(e) => setFormModal({ ...formModal, stok: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Detail <span className="text-danger">*</span></label>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                    value={formModal.detail}
                                    onChange={(e) => setFormModal({ ...formModal, detail: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4 gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus Buku">
                <div className="p-4">
                    <p className="mb-4">Apakah Anda yakin ingin menghapus buku <strong>"{selectedBook?.judul}"</strong>?</p>
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Batal
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detail Buku">
                <div className="p-4">
                    <div className="mb-3">
                        <h5 className="fw-bold">{detailBook.judul}</h5>
                        <p className="text-muted mb-4">Penulis: {detailBook.pengarang}</p>
                    </div>

                    <div className="border-top border-bottom py-3 mb-4">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <small className="text-muted d-block">No Rak</small>
                                    <p>{detailBook.no_rak}</p>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted d-block">Penerbit</small>
                                    <p>{detailBook.penerbit}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <small className="text-muted d-block">Tahun Terbit</small>
                                    <p>{detailBook.tahun_terbit}</p>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted d-block">Stok Tersedia</small>
                                    <p>{detailBook.stok}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <small className="text-muted d-block">Detail</small>
                        <p>{detailBook.detail}</p>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsDetailModalOpen(false)}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}