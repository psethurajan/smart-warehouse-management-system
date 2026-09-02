import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdCategory } from "react-icons/md";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Categories = () => {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await api.get("/categories");
    setCategories(data);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/categories/${editingId}`, form);
    } else {
      await api.post("/categories", form);
    }
    setShowModal(false);
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <Layout title="Categories">
      <div className="page-header">
        <div>
          <h2>Product Categories</h2>
          <p>Group products for easier organization and reporting</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <MdAdd /> Add Category
        </button>
      </div>

      <div className="card">
        {loading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <MdCategory />
            <p>No categories yet</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>{cat.name}</td>
                    <td>{cat.description || "-"}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginRight: 6 }}
                        onClick={() => openEditModal(cat)}
                      >
                        <MdEdit />
                      </button>
                      {isAdmin && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id)}>
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
        <Modal title={editingId ? "Edit Category" : "Add Category"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
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

export default Categories;
