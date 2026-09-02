import { useEffect, useState } from "react";
import { MdAdd, MdSwapHoriz } from "react-icons/md";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import api from "../api/axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({ product: "", type: "Stock In", quantity: "", reason: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data } = await api.get("/transactions");
    setTransactions(data);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await api.get("/products", { params: { limit: 1000 } });
    setProducts(data.products);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await api.post("/transactions", { ...form, quantity: Number(form.quantity) });
      setShowModal(false);
      setForm({ product: "", type: "Stock In", quantity: "", reason: "" });
      fetchTransactions();
      fetchProducts();
    } catch (error) {
      setFormError(error.response?.data?.message || "Something went wrong");
    }
  };

  const typeBadge = (type) => {
    const map = { "Stock In": "green", "Stock Out": "red", Adjustment: "blue" };
    return <span className={`badge ${map[type]}`}>{type}</span>;
  };

  return (
    <Layout title="Stock Transactions">
      <div className="page-header">
        <div>
          <h2>Stock Movement History</h2>
          <p>Every stock change is recorded permanently for audit purposes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd /> New Transaction
        </button>
      </div>

      <div className="card">
        {loading ? (
          <Loader />
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <MdSwapHoriz />
            <p>No stock transactions recorded yet</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Previous → New</th>
                  <th>Reason</th>
                  <th>Performed By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
                    <td>{t.product?.name} ({t.product?.sku})</td>
                    <td>{typeBadge(t.type)}</td>
                    <td>{t.quantity}</td>
                    <td>{t.previousStock} → {t.newStock}</td>
                    <td>{t.reason || "-"}</td>
                    <td>{t.performedBy?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Record Stock Transaction" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product</label>
              <select
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                required
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Current: {p.currentStock})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Transaction Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="Stock In">Stock In</option>
                  <option value="Stock Out">Stock Out</option>
                  <option value="Adjustment">Adjustment (set exact value)</option>
                </select>
              </div>
              <div className="form-group">
                <label>{form.type === "Adjustment" ? "New Stock Value" : "Quantity"}</label>
                <input
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reason / Note</label>
              <input
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="e.g. Sold to customer, damaged item, etc."
              />
            </div>

            {formError && <p className="error-text">{formError}</p>}

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Save Transaction</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default Transactions;
