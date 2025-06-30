import React, { useEffect, useState } from "react";
import Modal from "../../Components/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faTrash, faUserPen, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";

export default function Members() {
    const [members, setMembers] = useState([]);
    const [error, setError] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({
        no_ktp: "",
        nama: "",
        alamat: "",
        tgl_lahir: "",
    });
    const [alert, setAlert] = useState("");

    const [selectedMember, setSelectedMember] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [detailMember, setDetailMember] = useState({});
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchMember, setSearchMember] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(members.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMembers = members.slice(indexOfFirstItem, indexOfLastItem);

    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        axios
            .get(API_URL + "/member", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // jika menggunakan token
                },
            })

            .then((res) => setMembers(res.data))
            .catch((err) => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
                setError(err.response.data);
            });
    }

    function handleSubmitModal(e) {
        e.preventDefault();
        axios
            .post(API_URL + "/member", formModal, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setIsModalOpen(false);
                setAlert("Sukses menambah member baru!");
                setFormModal({ no_ktp: "", nama: "", alamat: "", tgl_lahir: "" });
                setError([]);
                fetchData();
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
                setError(err.response.data);
            });
    }

    function handleEditSubmit(e) {
        e.preventDefault();
        axios
            .put(`${API_URL}/member/${selectedMember.id}`, formModal, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setIsEditModalOpen(false);
                setSelectedMember(null);
                setAlert("Berhasil merubah data member!");
                setFormModal({
                    no_ktp: "",
                    nama: "",
                    alamat: "",
                    tgl_lahir: "",
                });
                setError([]);
                fetchData();
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/");
                }
                setError(err.response.data);
            });
    }

    function handleDelete() {
        axios.delete(`${API_URL}/member/${selectedMember.id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(() => {
                setIsDeleteModalOpen(false);
                setSelectedMember(null);
                setAlert("Berhasil menghapus member!");
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
        setDetailMember(books);
        setIsDetailModalOpen(true);
    }

    return (
        <>
            <div className="container-fluid" style={{ marginLeft: "120px", padding: "20px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0 text-primary">
                        <FontAwesomeIcon icon={faUsers} className="me-2" />
                        Daftar Member
                    </h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setIsModalOpen(true);
                            setFormModal({ no_ktp: "", nama: "", alamat: "", tgl_lahir: "" });
                            setError([]);
                        }}
                    >
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                        Tambah Member
                    </button>
                    {/* <div className="d-flex">
                    <input type="text" value={searchMember} onChange={(e) => setSearchMember(e.target.value)} placeholder="Cari member" />
                    <button className="btn btn-outline-info">
                        Cari
                    </button>
                    </div> */}
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '5%' }} className="ps-4">#</th>
                                        <th style={{ width: '5%' }}>ID Member</th>
                                        <th style={{ width: '15%' }}>No KTP</th>
                                        <th style={{ width: '15%' }}>Nama</th>
                                        <th style={{ width: '30%' }}>Alamat</th>
                                        <th style={{ width: '15%' }}>Tanggal Lahir</th>
                                        <th style={{ width: '15%' }} className="text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentMembers.map((value, index) => (
                                        <tr key={value.id}>
                                            <td className="ps-4">{index + 1}</td>
                                            <td>{value.id}</td>
                                            <td>{value.no_ktp}</td>
                                            <td>
                                                <span className="fw-semibold">{value.nama}</span>
                                            </td>
                                            <td className="text-truncate" style={{ maxWidth: '200px' }} title={value.alamat}>
                                                {value.alamat}
                                            </td>
                                            <td>
                                                {new Date(value.tgl_lahir).toLocaleDateString("id-ID", {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => {
                                                            setSelectedMember(value);
                                                            setIsDeleteModalOpen(true);
                                                            setError([]);
                                                        }}
                                                        title="Hapus"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => {
                                                            setSelectedMember(value);
                                                            setFormModal({
                                                                no_ktp: value.no_ktp,
                                                                nama: value.nama,
                                                                alamat: value.alamat,
                                                                tgl_lahir: value.tgl_lahir,
                                                            });
                                                            setIsEditModalOpen(true);
                                                            setError([]);
                                                        }}
                                                        title="Edit"
                                                    >
                                                        <FontAwesomeIcon icon={faUserPen} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-info"
                                                        onClick={() => {
                                                            handleBtnDetail(value);
                                                            setError([]);
                                                        }}
                                                        title="Detail"
                                                    >
                                                        <FontAwesomeIcon icon={faInfo} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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

                {/* Add Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Tambah Member Baru"
                >
                    <form onSubmit={handleSubmitModal}>
                        {Object.keys(error).length > 0 && (
                            <div className="alert alert-danger mb-4">
                                {error?.data && Object.entries(error.data).length > 0 ? (
                                    <ul className="mb-0">
                                        {Object.entries(error.data).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div>{error.message || "Terjadi kesalahan."}</div>
                                )}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                No KTP <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) =>
                                    setFormModal({ ...formModal, no_ktp: e.target.value })
                                }
                                value={formModal.no_ktp}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Nama Lengkap <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) =>
                                    setFormModal({ ...formModal, nama: e.target.value })
                                }
                                value={formModal.nama}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Alamat <span className="text-danger">*</span>
                            </label>
                            <textarea
                                className="form-control"
                                rows="3"
                                onChange={(e) =>
                                    setFormModal({ ...formModal, alamat: e.target.value })
                                }
                                value={formModal.alamat}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">
                                Tanggal Lahir <span className="text-danger">*</span>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) =>
                                    setFormModal({ ...formModal, tgl_lahir: e.target.value })
                                }
                                value={formModal.tgl_lahir}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Simpan
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title={`Edit Member - ${selectedMember?.nama || ''}`}
                >
                    <form onSubmit={handleEditSubmit}>
                        {Object.keys(error).length > 0 && (
                            <div className="alert alert-danger mb-4">
                                {error?.data && Object.entries(error.data).length > 0 ? (
                                    <ul className="mb-0">
                                        {Object.entries(error.data).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div>{error.message || "Terjadi kesalahan."}</div>
                                )}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                No KTP <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) =>
                                    setFormModal({ ...formModal, no_ktp: e.target.value })
                                }
                                value={formModal.no_ktp}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Nama Lengkap <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) =>
                                    setFormModal({ ...formModal, nama: e.target.value })
                                }
                                value={formModal.nama}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Alamat <span className="text-danger">*</span>
                            </label>
                            <textarea
                                className="form-control"
                                rows="3"
                                onChange={(e) =>
                                    setFormModal({ ...formModal, alamat: e.target.value })
                                }
                                value={formModal.alamat}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">
                                Tanggal Lahir <span className="text-danger">*</span>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) =>
                                    setFormModal({ ...formModal, tgl_lahir: e.target.value })
                                }
                                value={formModal.tgl_lahir}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Modal delete */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Konfirmasi Hapus Member"
                >
                    <div className="p-4">
                        <p className="mb-4">
                            Apakah Anda yakin ingin menghapus member <strong>"{selectedMember?.nama}"</strong>?
                        </p>
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
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Modal detail */}
                <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detail Member">
                                <div className="p-4">
                                    <div className="mb-3">
                                        <h5 className="fw-bold">{detailMember.nama}</h5>
                                    </div>
                
                                    <div className="border-top border-bottom py-3 mb-4">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">No KTP</small>
                                                </div>
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">Alamat</small>
                                                </div>
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">Tanggal Lahir</small>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">{detailMember.no_ktp}</small>
                                                </div>
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">{detailMember.alamat}</small>
                                                </div>
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">{detailMember.tgl_lahir}</small>
                                                </div>
                                            </div>
                                        </div>
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
            </div>
        </>
    );
}
