import { useEffect, useState } from "react";
import { MdAdd, MdPeople, MdDelete, MdToggleOn, MdToggleOff } from "react-icons/md";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import api from "../api/axios";

const emptyForm = { name: "", email: "", password: "", role: "staff", phone: "" };

const Employees = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await api.get("/users");
    setUsers(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await api.post("/auth/register", form);
      setShowModal(false);
      setForm(emptyForm);
      fetchUsers();
    } catch (error) {
      setFormError(error.response?.data?.message || "Something went wrong");
    }
  };

  const toggleActive = async (u) => {
    await api.put(`/users/${u._id}`, { ...u, isActive: !u.isActive });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this employee?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const roleBadge = (role) => {
    const map = { admin: "red", manager: "blue", staff: "green" };
    return <span className={`badge ${map[role]}`}>{role}</span>;
  };

  return (
    <Layout title="Employees">
      <div className="page-header">
        <div>
          <h2>Employee Accounts</h2>
          <p>Create and manage manager / staff login accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd /> Add Employee
        </button>
      </div>

      <div className="card">
        {loading ? (
          <Loader />
        ) : users.length === 0 ? (
          <div className="empty-state">
            <MdPeople />
            <p>No employees found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || "-"}</td>
                    <td>{roleBadge(u.role)}</td>
                    <td>
                      <span className={`badge ${u.isActive ? "green" : "gray"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginRight: 6 }}
                        onClick={() => toggleActive(u)}
                      >
                        {u.isActive ? <MdToggleOn /> : <MdToggleOff />}
                      </button>
                      {u.role !== "admin" && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
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
        <Modal title="Add Employee" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="staff">Inventory Staff</option>
                  <option value="manager">Warehouse Manager</option>
                </select>
              </div>
            </div>

            {formError && <p className="error-text">{formError}</p>}

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Create Account</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default Employees;
