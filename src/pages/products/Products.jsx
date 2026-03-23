import { useState, useContext, useEffect } from 'react';
import { Edit2, Trash2, Plus, Save, X, LogOut } from 'lucide-react';
import { data, useNavigate } from 'react-router-dom';
import './Products.css';
import toast from 'react-hot-toast';
import { appContext } from '../../context/context.jsx';

const Products = () => {
  const navigate = useNavigate();
  const { URL } = useContext(appContext)
  const [loding, setLoding] = useState(false);
  const token = localStorage.getItem("token")
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleEdit = (product) => {
    setEditingId(product.id);
    const filterproduct = (products.filter(item => item.id == product.id));
    setEditForm(filterproduct[0])
  };

  const handleSave = async () => {
    if (!editForm.name || !editForm.price || !editForm.stock || !editForm.category) {
      toast.error("Please fill all fields before saving.");
      return;
    }
    try {
      setLoding(true)
      const res = await fetch(URL + "/products/update-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      if (data.success) {
        getProducts()
        setLoding(false)
        toast.success(data.message);
        setEditingId(null);
        return
      }
      toast.error(data.message)
    } finally {
      setEditingId(null);
      setLoding(false)
    }

  };

  const handleDelete = async (id) => {
    try {
      setLoding(true)
      const res = await fetch(URL + "/products/delete-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: id })
      })
      const data = await res.json()
      if (data.success) {
        getProducts()
        setLoding(false)
        toast.success(data.message);
        setDeleteConfirmId(null);
        return
      }
      toast.error(data.message)
    } finally {
      setLoding(false)
      setDeleteConfirmId(null);
    }

  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.price || !addForm.stock || !addForm.category) {
      toast.error("Please fill all fields to add a product.");
      return;
    }
    try {
      setLoding(true)
      const newProduct = {
        name: addForm.name,
        category: addForm.category,
        price: Number(addForm.price),
        stock: Number(addForm.stock)
      };
      const res = await fetch(URL + "/products/create-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newProduct })
      })
      const data = await res.json()
      if (data.success) {
        getProducts()
        setLoding(false)
        toast.success(data.message);
        return
      }
      toast.error(data.message)
    } finally {
      setLoding(false)
    }

  };



  const getProducts = async () => {
    const res = await fetch(URL + "/products/get-products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    setProducts(data)
  }
  useEffect(() => { getProducts() }, [token])

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  if (loding) {
    return (
      <div className="products-container loading-state">
        <div className="loader"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-card">
        <div className="products-header">
          <div>
            <h1>Product Management</h1>
            <p>View and manage your store inventory</p>
          </div>
          <div className="header-actions">
            <button className="add-button" onClick={() => setIsAdding(!isAdding)}>
              {isAdding ? <X size={20} /> : <Plus size={20} />}
              {isAdding ? "Cancel" : "Add Product"}
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="add-product-form">
            <h3>Add New Product</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Product Name" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input type="text" value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })} placeholder="Category" />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: e.target.value })} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" value={addForm.stock} onChange={e => setAddForm({ ...addForm, stock: e.target.value })} placeholder="0" />
              </div>
            </div>
            <button className="save-button full-width" onClick={handleAddSubmit}>Save Product</button>
          </div>
        )}

        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="action-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No products found.</td>
                </tr>
              ) : (
                currentProducts.map((product) => (
                  <tr key={product.id}>
                    {editingId === product.id ? (
                      <>
                        <td>
                          <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="edit-input" />
                        </td>
                        <td>
                          <input type="text" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="edit-input" />
                        </td>
                        <td>
                          <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="edit-input" />
                        </td>
                        <td>
                          <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} className="edit-input" />
                        </td>
                        <td className="action-cell">
                          <button className="action-btn save-btn" onClick={handleSave} title="Save">
                            <Save size={18} />
                          </button>
                          <button className="action-btn cancel-btn" onClick={() => setEditingId(null)} title="Cancel">
                            <X size={18} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="product-name">{product.name}</td>
                        <td className="product-category"><span className="category-badge">{product.category}</span></td>
                        <td className="product-price">₹{product.price}</td>
                        <td className="product-stock">
                          <span className={`stock-indicator ${product.stock < 50 ? 'low-stock' : 'in-stock'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button className="action-btn edit-btn" onClick={() => handleEdit(product)} title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button className="action-btn delete-btn" onClick={() => setDeleteConfirmId(product.id)} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button className="page-btn" onClick={nextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}

        {deleteConfirmId && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h3>Delete Product</h3>
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="popup-actions">
                <button className="popup-btn popup-cancel-btn" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
                <button className="popup-btn delete-confirm-btn" onClick={() => { handleDelete(deleteConfirmId) }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
