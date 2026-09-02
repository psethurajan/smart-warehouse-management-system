import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdWarehouse } from "react-icons/md";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import api from "../api/axios";

const emptyForm = { name: "", location: "", capacity: "" };

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    const { data } = await api.get("/warehouses");
    setWarehouses(data);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (wh) => {
    setEditingId(wh._id);
    setForm({ name: wh.name, location: wh.location, capacity: wh.capacity });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/warehouses/${editingId}`, form);
    } else {
      await api.post("/warehouses", form);
    }
    setShowModal(false);
    fetchWarehouses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this warehouse?")) return;
    await api.delete(`/warehouses/${id}`);
    fetchWarehouses();
  };

  return (
    <Layout title="Warehouses">
      <div className="page-header">
        <div>
          <h2>Warehouses</h2>
          <p>Track capacity and utilization across warehouse locations</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <MdAdd /> Add Warehouse
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {warehouses.map((wh) => (
            <div className="card" key={wh._id}>
              <div className="card-header">
                <h3><MdWarehouse style={{ verticalAlign: "middle", marginRight: 6 }} />{wh.name}</h3>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>{wh.location}</p>

              <div style={{ marginBottom: 8, fontSize: 13 }}>
                {wh.usedUnits} / {wh.capacity} units used ({wh.utilization}%)
              </div>
              <div style={{ background: "#eef1f6", borderRadius: 6, height: 8, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min(wh.utilization, 100)}%`,
                    height: "100%",
                    background: wh.utilization > 85 ? "#dc2626" : "#0d9488",
                  }}
                />
              </div>

              <div className="form-actions" style={{ marginTop: 16 }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEditModal(wh)}>
                  <MdEdit /> Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(wh._id)}>
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editingId ? "Edit Warehouse" : "Add Warehouse"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Warehouse Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacity (units)</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                required
              />
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

export default Warehouses;
