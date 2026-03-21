import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import './Products.css';
import toast from 'react-hot-toast';
import { dummyProducts } from '../../assets/dummy.js';

const Products = () => {
  const [loding, setLoding] = useState(false);
  const [products, setProducts] = useState(dummyProducts);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.price || !editForm.stock || !editForm.category) {
      toast.error("Please fill all fields before saving.");
      return;
    }
    setProducts(products.map(p => p.id === editingId ? { ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) } : p));
    setEditingId(null);
    setEditForm(null);
    toast.success("Product updated successfully!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted.");
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.price || !addForm.stock || !addForm.category) {
      toast.error("Please fill all fields to add a product.");
      return;
    }
    const newProduct = {
      id: Date.now(),
      name: addForm.name,
      category: addForm.category,
      price: Number(addForm.price),
      stock: Number(addForm.stock)
    };
    setProducts([...products, newProduct]);
    setIsAdding(false);
    setAddForm({ name: '', category: '', price: '', stock: '' });
    toast.success("New product added!");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  console.log(indexOfFirstItem)
  console.log(indexOfLastItem)
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
          <button className="add-button" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            {isAdding ? "Cancel" : "Add Product"}
          </button>
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
                        <td className="product-price">₹{product.price.toFixed(2)}</td>
                        <td className="product-stock">
                          <span className={`stock-indicator ${product.stock < 50 ? 'low-stock' : 'in-stock'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button className="action-btn edit-btn" onClick={() => handleEdit(product)} title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(product.id)} title="Delete">
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
      </div>
    </div>
  );
};

export default Products;
