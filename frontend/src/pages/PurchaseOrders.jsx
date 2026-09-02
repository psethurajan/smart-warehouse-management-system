import { useEffect, useState } from "react";
import { MdAdd, MdReceiptLong, MdDelete } from "react-icons/md";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const PurchaseOrders = () => {
  const { user } = useAuth();
  const canManage = user.role === "admin" || user.role === "manager";

  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [supplier, setSupplier] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: 1, price: 0 }]);

  useEffect(() => {
    fetchOrders();
    fetchDropdowns();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await api.get("/purchase-orders");
    setOrders(data);
    setLoading(false);
  };

  const fetchDropdowns = async () => {
    const [supRes, prodRes] = await Promise.all([
      api.get("/suppliers"),
      api.get("/products", { params: { limit: 1000 } }),
    ]);
    setSuppliers(supRes.data);
    setProducts(prodRes.data.products);
  };

  const addItemRow = () => setItems([...items, { product: "", quantity: 1, price: 0 }]);

  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;

    // Auto-fill price from the product's purchase price when a product is selected
    if (key === "product") {
      const selected = products.find((p) => p._id === value);
      if (selected) updated[index].price = selected.purchasePrice;
    }

    setItems(updated);
  };

  const removeItemRow = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/purchase-orders", {
      supplier,
      expectedDelivery,
      items: items.map((i) => ({ ...i, quantity: Number(i.quantity), price: Number(i.price) })),
    });
    setShowModal(false);
    setSupplier("");
    setExpectedDelivery("");
    setItems([{ product: "", quantity: 1, price: 0 }]);
    fetchOrders();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/purchase-orders/${id}/status`, { status });
    fetchOrders();
  };

  const statusBadge = (status) => {
    const map = { Pending: "orange", Approved: "blue", Rejected: "red", Received: "green" };
    return <span className={`badge ${map[status]}`}>{status}</span>;
  };

  return (
    <Layout title="Purchase Orders">
      <div className="page-header">
        <div>
          <h2>Purchase Orders</h2>
          <p>Track orders from request to stock received</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <MdAdd /> Create Order
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <MdReceiptLong />
            <p>No purchase orders yet</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  {canManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.supplier?.companyName}</td>
                    <td>{order.items.length} item(s)</td>
                    <td>₹{order.totalAmount.toLocaleString("en-IN")}</td>
                    <td>{statusBadge(order.status)}</td>
                    {canManage && (
                      <td>
                        {order.status === "Pending" && (
                          <>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ marginRight: 6 }}
                              onClick={() => handleStatusChange(order._id, "Approved")}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleStatusChange(order._id, "Rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {order.status === "Approved" && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStatusChange(order._id, "Received")}
                          >
                            Mark Received
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Create Purchase Order" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Supplier</label>
              <select value={supplier} onChange={(e) => setSupplier(e.target.value)} required>
                <option value="">Select supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>{s.companyName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Expected Delivery</label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                required
              />
            </div>

            <label style={{ fontSize: 13, fontWeight: 500 }}>Order Items</label>
            {items.map((item, index) => (
              <div className="form-row" key={index} style={{ marginTop: 10, alignItems: "end" }}>
                <div className="form-group">
                  <label>Product</label>
                  <select
                    value={item.product}
                    onChange={(e) => updateItem(index, "product", e.target.value)}
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", e.target.value)}
                      required
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ height: 38, marginTop: 22 }}
                      onClick={() => removeItemRow(index)}
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: 10 }} onClick={addItemRow}>
              <MdAdd /> Add Another Item
            </button>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Create Order</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default PurchaseOrders;
