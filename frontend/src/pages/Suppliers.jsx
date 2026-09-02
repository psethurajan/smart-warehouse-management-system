import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdLocalShipping, MdStar } from "react-icons/md";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const emptyForm = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  gstNumber: "",
  rating: 3,
};

const Suppliers = () => {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    const { data } = await api.get("/suppliers");
    setSuppliers(data);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setEditingId(supplier._id);
    setForm(supplier);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/suppliers/${editingId}`, form);
    } else {
      await api.post("/suppliers", form);
    }
    setShowModal(false);
    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    await api.delete(`/suppliers/${id}`);
    fetchSuppliers();
  };

  return (
    <Layout title="Suppliers">
      <div className="page-header">
        <div>
          <h2>Suppliers</h2>
          <p>Manage vendor and supplier information</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <MdAdd /> Add Supplier
        </button>
      </div>

      <div className="card">
        {loading ? (
          <Loader />
        ) : suppliers.length === 0 ? (
          <div className="empty-state">
            <MdLocalShipping />
            <p>No suppliers yet</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s._id}>
                    <td>{s.companyName}</td>
                    <td>{s.contactPerson}</td>
                    <td>{s.phone}</td>
                    <td>{s.email}</td>
                    <td>
                      <MdStar style={{ color: "#d97706", verticalAlign: "middle" }} /> {s.rating}/5
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginRight: 6 }}
                        onClick={() => openEditModal(s)}
                      >
                        <MdEdit />
                      </button>
                      {isAdmin && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>
                          <MdDelete />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editingId ? "Edit Supplier" : "Add Supplier"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>GST Number</label>
                <input
                  value={form.gstNumber}
                  onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default Suppliers;
