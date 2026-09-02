import { useEffect, useState } from "react";
import { MdSearch, MdAdd, MdEdit, MdDelete, MdInventory2 } from "react-icons/md";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  supplier: "",
  warehouse: "",
  purchasePrice: "",
  sellingPrice: "",
  currentStock: "",
  reorderLevel: "",
  unit: "pcs",
};

const Products = () => {
  const { user } = useAuth();
  const canEdit = user.role === "admin" || user.role === "manager";
  const canDelete = user.role === "admin";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, stockStatus, page]);

  const fetchDropdownData = async () => {
    const [catRes, supRes, whRes] = await Promise.all([
      api.get("/categories"),
      api.get("/suppliers"),
      api.get("/warehouses"),
    ]);
    setCategories(catRes.data);
    setSuppliers(supRes.data);
    setWarehouses(whRes.data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: { search, stockStatus, page, limit: 8 },
      });
      setProducts(data.products);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category?._id || "",
      supplier: product.supplier?._id || "",
      warehouse: product.warehouse?._id || "",
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
      unit: product.unit,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post("/products", form);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      setFormError(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const stockBadge = (product) => {
    if (product.currentStock === 0) return <span className="badge red">Out of Stock</span>;
    if (product.currentStock <= product.reorderLevel)
      return <span className="badge orange">Low Stock</span>;
    return <span className="badge green">In Stock</span>;
  };

  return (
    <Layout title="Products">
      <div className="page-header">
        <div>
          <h2>Product Inventory</h2>
          <p>Manage all warehouse products in one place</p>
        </div>
        {canEdit && (
          <button className="btn btn-primary" onClick={openAddModal}>
            <MdAdd /> Add Product
          </button>
        )}
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="search-box">
            <MdSearch />
            <input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
          <select
            className="filter-select"
            value={stockStatus}
            onChange={(e) => {
              setPage(1);
              setStockStatus(e.target.value);
            }}
          >
            <option value="">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <MdInventory2 />
            <p>No products found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Warehouse</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category?.name}</td>
                    <td>{product.supplier?.companyName}</td>
                    <td>{product.warehouse?.name}</td>
                    <td>₹{product.sellingPrice}</td>
                    <td>{product.currentStock} {product.unit}</td>
                    <td>{stockBadge(product)}</td>
                    {canEdit && (
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ marginRight: 6 }}
                          onClick={() => openEditModal(product)}
                        >
                          <MdEdit />
                        </button>
                        {canDelete && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            <MdDelete />
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

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={p === page ? "active" : ""}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editingId ? "Edit Product" : "Add Product"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <select
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  required
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>{s.companyName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Warehouse</label>
                <select
                  value={form.warehouse}
                  onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
                  required
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w._id} value={w._id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Unit</label>
                <input
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="pcs, kg, box..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Purchase Price (₹)</label>
                <input
                  type="number"
                  value={form.purchasePrice}
                  onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Selling Price (₹)</label>
                <input
                  type="number"
                  value={form.sellingPrice}
                  onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Current Stock</label>
                <input
                  type="number"
                  value={form.currentStock}
                  onChange={(e) => setForm({ ...form, currentStock: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reorder Level</label>
                <input
                  type="number"
                  value={form.reorderLevel}
                  onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
                  required
                />
              </div>
            </div>

            {formError && <p className="error-text">{formError}</p>}

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default Products;
