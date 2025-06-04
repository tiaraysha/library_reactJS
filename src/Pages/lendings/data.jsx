import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import Modal from "../../Components/Modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";


export default function Restoration() {
    const [lendings, setLendings] = useState([]);
    const [error, setError] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({
        id: "",
        id_member: "",
        tgl_pinjam: "",
        tgl_pengembalian: ""
    })
    const [alert, setAlert] = useState("");
    const [detailLending, setDetailLending] = useState([]);

    const [formDenda, setFormDenda] = useState({
        id_member: "",
        id_buku: "",
        jenis_denda: "",
        jumlah_denda: "",
        deskripsi: "",
        tgl_pinjam: "",
        tgl_pengembalian: ""

    });
    const [detailRestoration, setDetailRestoration] = useState([]);
    const [isModalRestorationOpen, setIsModalRestorationOpen] = useState(false);

    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [lateDays, setLateDays] = useState(0);

    const [member, setMember] = useState([]);
    const [isDetailMember, setIsDetailMember] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const itemsPerPage = 20;

    const totalPages = Math.ceil(lendings.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLendings = lendings.slice(indexOfFirstItem, indexOfLastItem);



    const navigate = useNavigate();

    function fetchData() {
        axios.get(API_URL + "/peminjaman", {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}` // jika menggunakan token
            }
        })

            .then((res) => setLendings(res.data.data))
            .catch((err) => {
                if (err.status == 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
                setError(err.response.data);
            })
    }

    useEffect(() => {
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let jumlah = "";

        if (formDenda.jenis_denda === "kerusakan" && lateDays > 0) {
            jumlah = 10000 + (lateDays * 2000);
        } else if (formDenda.jenis_denda === "lainnya" && lateDays > 0) {
            jumlah = 5000 + (lateDays * 2000);
        } else if (formDenda.jenis_denda === "terlambat") {
            jumlah = lateDays * 2000;
        } else if (formDenda.jenis_denda === "kerusakan") {
            jumlah = 10000;
        } else if (formDenda.jenis_denda === "lainnya") {
            jumlah = 5000;
        }

        setFormDenda((prev) => ({ ...prev, jumlah_denda: jumlah }));
    }, [formDenda.jenis_denda, lateDays]);


    function handleBtnCreate(lending) {
        setDetailLending(lending);
        setFormModal({
            ...formModal,
            lending_id: lending.id,
            id_member: lending.id_member,
            id_buku: lending.id_buku,
            tgl_pinjam: lending.tgl_pinjam,
            tgl_pengembalian: lending.tgl_pengembalian
        });

        setFormDenda({
            id_member: lending.id_member,
            id_buku: lending.id_buku,
            jenis_denda: "",
            jumlah_denda: "",
            deskripsi: ""
        });

        const today = new Date();
        const returnDate = new Date(lending.tgl_pengembalian);

        if (lending.status_pengembalian == 0 && today > returnDate) {
            const diffTime = today - returnDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setLateDays(diffDays);
        } else {
            setLateDays(0);
        }

        setIsModalOpen(true);
    }


    function handleBtnDetail(restoration) {
        setDetailRestoration(restoration);
        setIsModalRestorationOpen(true);
    }

    function handleSubmitForm(e) {
        e.preventDefault();
        axios.put(API_URL + `/peminjaman/pengembalian/${detailLending.id}`, formModal, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}` // jika menggunakan token
            }
        })
            .then((res) => {
                setIsModalOpen(false);
                setFormModal({
                    id: "",
                    tgl_pinjam: "",
                    tgl_pengembalian: "",
                });
                setDetailLending([]);
                setAlert("Sukses melakukan pengembalian!");
                fetchData();
            })
            .catch((err) => {
                if (err.status == 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
                setError(err.response.data);
            })
    }

    function handleBtnDenda(e) {
        e.preventDefault();

        axios.post(API_URL + '/denda', formDenda, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                return axios.put(API_URL + `/peminjaman/pengembalian/${detailLending.id}`, formModal, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                });
            })
            .then((res) => {
                setIsModalOpen(false);
                setIsSecondModalOpen(false);
                setFormDenda({
                    id_buku: "",
                    id_member: "",
                    jenis_denda: "",
                    jumlah_denda: "",
                    deskripsi: ""
                });
                setDetailLending([]);
                setAlert("Sukses melakukan pengembalian!");
                fetchData();
            })
            .catch((err) => {
                if (err.status == 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
                setError(err.response?.data || { message: "Terjadi kesalahan saat proses denda dan pengembalian." });
            });
    }

    function detailMember(id) {
        axios.get(API_URL + '/peminjaman/' + id, {
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

    function exportExcel() {
        // buat format data (column) apa saja yang akan dibuat pada excel
        const formattedData = lendings.map((item, index) => ({
            No: index + 1,
            IdMember: item.id_member,
            IdBuku: item.id_buku,
            TanggalPinjam: new Date(item.tgl_pinjam).toLocaleDateString("id-ID", { dateStyle: "long" }),
            TanggalPengembalian: new Date(item.tgl_pengembalian).toLocaleDateString("id-ID", { dateStyle: "long" }),
            StatusPengembalian: item.status_pengembalian == 1 ? "Sudah Dikembalikan" : "Belum Dikembalikan"
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        saveAs(file, "data_peminjaman.xlsx"); //download file
    }

    function exportPdf() {
        const doc = new jsPDF("p", "pt", "a4");
        autoTable(doc, {
            head: [
                ["IdPeminjaman", "IdBuku", "TanggalPinjam", "TanggalPengembalian", "StatusPengembalian"],
            ],
            body: member.map((item, index) => [
                item.id,
                item.id_buku,
                new Date(item.tgl_pinjam).toLocaleDateString("id-ID", { dateStyle: "long" }),
                new Date(item.tgl_pengembalian).toLocaleDateString("id-ID", { dateStyle: "long" }),
                item.status_pengembalian == 1 ? "Sudah Dikembalikan" : "Belum Dikembalikan"
            ]),
        });
        doc.save("data_peminjaman.pdf");
    }


    return (
        <>
            <div className="container-fluid" style={{ marginLeft: "150px", padding: "20px" }}></div>
            {
                alert && (
                    <div className="alert alert-success alert-dismissible fade show mb-4" style={{ marginLeft: "200px", padding: "20px" }}>
                        {alert}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setAlert("")}
                        />
                    </div>
                )}
            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-success" onClick={exportExcel}>Export <FontAwesomeIcon icon={faFileExcel} /></button>
            </div>
            <div className="d-flex flex-wrap" style={{ marginLeft: "200px", padding: "20px" }}>
                <h3 className="text-start mt-3">Daftar Pengembalian <FontAwesomeIcon icon={faMoneyBillTransfer} /></h3>
                <table className="table table-borderless mt-3">
                    <thead>
                        <tr className="table-info">
                            <th scope="col">#</th>
                            {/* <th scope="col">Id</th> */}
                            <th scope="col">Id_member</th>
                            <th scope="col">Id_buku</th>
                            <th scope="col">Tanggal Pinjam</th>
                            <th scope="col">Tanggal Pengembalian</th>
                            <th scope="col">Status Pengembalian</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLendings.map((value, index) => {
                            return (
                                <tr key={value.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    {/* <td>{value.id}</td> */}
                                    <td style={{
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        color: '#3b82f6',
                                        padding: '12px'
                                    }} onClick={() => detailMember(value.id_member)}>
                                        {value.id_member}
                                    </td>
                                    <td>{value.id_buku}</td>
                                    <td>{new Date(value.tgl_pinjam).toLocaleDateString("id-ID", { dateStyle: "long" })}</td>
                                    <td>{new Date(value.tgl_pengembalian).toLocaleDateString("id-ID", { dateStyle: "long" })}</td>
                                    <td>{value.status_pengembalian == 0 ? (<p className="text-danger fw-bold">Belum dikembalikan</p>) :
                                        (<p className="text-success fw-bold">Sudah dikembalikan</p>)}</td>
                                    <td className="w-25 text-center">

                                        {
                                            value.status_pengembalian == 1 ? (<button className="btn btn-outline-info" onClick={() => handleBtnDetail(value)}>Detail Pengembalian</button>)
                                                : (<button className="btn btn-primary" onClick={() => handleBtnCreate(value)}>Create Restoration</button>)
                                        }

                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center my-3">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>


            {/* modal pengembalian */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Restoration">
                {Object.keys(error).length > 0 && (
                    <ol className="alert alert-danger m-2 p-2 mt-3">
                        {
                            error?.data && Object.entries(error.data).length > 0
                                ? Object.entries(error.data).map(([key, value]) => (
                                    <li key={key}>{value}</li>
                                ))
                                : <li>{error.message || "Terjadi kesalahan."}</li>
                        }
                    </ol>
                )}
                {/* Error & form section */}
                <form onSubmit={handleSubmitForm}>
                    <div className="form-group">
                        <p>Apakah buku dengan <b>id: {detailLending.id_buku}</b> sudah dikembalikan?</p>
                    </div>

                    {
                        lateDays > 0 ? (
                            <p className="text-danger">
                                Terlambat mengembalikan selama: <b>{lateDays} hari</b>
                            </p>
                        ) : (
                            <p className="text-success">
                                Tidak ada keterlambatan pengembalian.
                            </p>
                        )
                    }

                    <div className="mt-3 d-flex justify-content-between">
                        {
                            lateDays > 0 ? (
                                <button type="button" className="btn btn-secondary" onClick={() => setIsSecondModalOpen(true)}>Lihat Info Denda</button>
                            ) : (
                                <button type="submit" className="btn btn-primary">Lakukan Pengembalian</button>
                            )
                        }
                    </div>
                </form>
            </Modal>

            {/* modal denda */}
            <Modal isOpen={isSecondModalOpen} onClose={() => setIsSecondModalOpen(false)} title="Info Denda">
                <form onSubmit={handleBtnDenda}>
                    {
                        lateDays > 0 ? (
                            <p className="text-danger">
                                Terlambat mengembalikan selama: <b>{lateDays} hari</b>
                            </p>
                        ) : (
                            <p className="text-success">
                                Tidak ada keterlambatan pengembalian.
                            </p>
                        )
                    }

                    <div className="form-group">
                        <label className="form-label fw-bold">id_member <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={formDenda.id_member}
                            onChange={(e) => setFormDenda({ ...formDenda, id_member: e.target.value })}
                        />

                        <label className="form-label fw-bold">id_buku <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setFormDenda({ ...formDenda, id_buku: e.target.value })}
                            value={formDenda.id_buku}
                        />

                        <label className="form-label fw-bold">Jenis Denda <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            onChange={(e) => setFormDenda({ ...formDenda, jenis_denda: e.target.value })}>
                            <option value="">-- Pilih Jenis Denda --</option>
                            <option value="terlambat">Terlambat</option>
                            <option value="kerusakan">Kerusakan</option>
                            <option value="lainnya">Lainnya</option>
                        </select>

                        <label className="form-label fw-bold">jumlah_denda <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={formDenda.jumlah_denda}
                            readOnly
                        />

                        <label className="form-label fw-bold">Deskripsi <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setFormDenda({ ...formDenda, deskripsi: e.target.value })}
                            value={formDenda.deskripsi}
                        />
                    </div>

                    <button className="btn btn-primary mt-2" type="submit">Proccess</button>
                </form>
            </Modal>


            {/* DETAIL RESTORATION */}
            <Modal isOpen={isModalRestorationOpen} onClose={() => setIsModalRestorationOpen(false)} title="Detail Restoration">

                <div className="form-group mt-2">
                    <ol>
                        <li>Tanggal Peminjaman: <b>{new Date(detailRestoration.tgl_pinjam).toLocaleDateString("id-ID", { dateStyle: "long" })}</b></li>
                        <li>Tanggal Pengembalian: <b>{new Date(detailRestoration.tgl_pengembalian).toLocaleDateString("id-ID", { dateStyle: "long" })}</b></li>
                        <li>Id_buku: <b>{detailRestoration.id_buku}</b></li>
                        <li>Id_member: <b>{detailRestoration.id_member}</b></li>
                    </ol>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalRestorationOpen(false)}>Close</button>
                </div>
            </Modal>

            {/* DETAIL MEMBER */}
            <Modal isOpen={isDetailMember} onClose={() => setIsDetailMember(false)} title="Detail Member">
                <div className="d-flex justify-content-end">
                    <button className="btn btn-danger" onClick={exportPdf}>Export <FontAwesomeIcon icon={faFilePdf} /></button>
                </div>
                <div className="form-group mt-2">
                    {member.map((item, index) => {
                        return (
                            <div key={index} className=" m-3 p-3 border rounded shadow">
                                <p><strong>ID Peminjaman:</strong> {item.id}</p>
                                <p><strong>ID Buku:</strong> {item.id_buku}</p>
                                <p><strong>Tanggal Pinjam:</strong> {item.tgl_pinjam}</p>
                                <p><strong>Tanggal Pengembalian:</strong> {item.tgl_pengembalian}</p>
                                <p><strong>Status Pengembalian:</strong> {item.status_pengembalian === 1 ? 'Sudah' : 'Belum'}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsDetailMember(false)}>Close</button>
                </div>
            </Modal>
        </>
    );
}