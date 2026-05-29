import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, LayoutGrid, List, Edit, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/use.products.js';
import ProductCard from '../components/ProductCard.jsx';
import Button from '../components/Button.jsx';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const MyProducts = () => {
  const { getProducts, deleteProductBySaller } = useProducts();
  const { products, loading } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const [product, setProduct] = useState(products);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setProduct(products);
  }, [products]);

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const data = await deleteProductBySaller(id);
        if (data.status === "success") {
          setProduct((prev) => prev.filter((p) => p._id !== id));
          toast.success("Product deleted successfully");
        }
      } catch (error) {
        toast.error("Error deleting product");
      }
    }
  };

  const editProduct = (id) => {
    navigate(`/dashboard/seller-products/${id}`)
    // Future implementation: open pre-filled form modal or redirect
  };

  if (loading && products.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="w-1/3 h-12 bg-[var(--border-strong)] rounded animate-pulse" />
        <div className="w-full h-64 bg-[var(--border-subtle)] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="heading mb-2">Product Management</h1>
          <p className="subheading">Manage your store's inventory, pricing, and details.</p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/dashboard/create-product')}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </Button>
        </div>
      </div>

      <div className="card">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 bg-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors w-64"
              />
            </div>
            <button className="btn-secondary flex items-center gap-2 bg-[var(--color-primary)] border border-[var(--border-subtle)] text-gray-700 hover:bg-[var(--border-subtle)]">
              <Filter size={18} />
              Filter
            </button>
          </div>
          <div className="flex gap-2 bg-[var(--border-subtle)] p-1 rounded-lg border border-[var(--border-subtle)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-primary)] shadow-sm text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-[var(--color-primary)] shadow-sm text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {product.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-[var(--border-subtle)] rounded-full flex items-center justify-center text-[var(--text-muted)]">
              <Package size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">No Products Found</h2>
              <p className="text-[var(--text-secondary)] max-w-sm">You haven't added any products to your store yet.</p>
            </div>
            <Button onClick={() => navigate('/dashboard/create-product')}>
              Add Your First Product
            </Button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onDelete={deleteProduct}
                    onEdit={editProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--border-subtle)] text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold rounded-tl-lg">Product</th>
                      <th className="py-3 px-4 font-semibold">Price</th>
                      <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.map((p) => (
                      <tr key={p._id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] transition-colors group" onClick={() => navigate(`/dashboard/seller-products/${p._id}`)}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--border-subtle)]">
                              <img src={p.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold">{p.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{p.price?.currency === "INR" ? "₹" : p.price?.currency === "USD" ? "$" : p.price?.currency} {p.variants[0]?.sellingPrice}</td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2  group-hover:opacity-100 transition-opacity">
                            <button onClick={() => editProduct(p._id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--color-accent)] hover:bg-yellow-50 rounded-lg transition-colors">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => deleteProduct(p._id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
