import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, UploadCloud, Info, DollarSign } from 'lucide-react';
import { useProducts } from '../hooks/use.products.js';
import Button from '../components/Button';
import Input from '../components/Input';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { loading } = useSelector((state) => state.product);
  const { user, isInitialized } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    sellingPriceAmount: '',
    priceCurrency: 'INR',
    category: 'apparel',
    stock: ''
  });
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({
    price: '',
    sellingPrice: '',
    stock: '',
    title: '',
    description: '',
    size: '',
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    try {
      const productData = new FormData();
      productData.append('title', formData.title);
      productData.append('description', formData.description);
      productData.append('priceAmount', formData.priceAmount);
      productData.append('sellingPriceAmount', formData.sellingPriceAmount);
      productData.append('priceCurrency', formData.priceCurrency);
      productData.append('category', formData.category);
      productData.append('stock', formData.stock);
      productData.append('baseImageCount', images.length);

      const variantsWithImageCount = variants.map(v => ({
        ...v,
        imageCount: v.images?.length || 0
      }));
      productData.append('variants', JSON.stringify(variantsWithImageCount));
      productData.append('sallerId', user._id);

      // Append base images
      images.forEach((image) => {
        productData.append('images', image);
      });

      // Append all variant images in order
      variants.forEach((v) => {
        v.images?.forEach((img) => {
          productData.append('images', img);
        });
      });
      console.log(productData)
      const response = await addProduct(productData);
      if (response?.status === 'success') {
        toast.success("Product created successfully!");
        navigate('/dashboard/products');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create product");
    }
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewVariant(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeVariantImagePreview = (index) => {
    setNewVariant(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addVariantToList = (e) => {
    e.preventDefault();
    if (!newVariant.price || !newVariant.sellingPrice || !newVariant.stock || !newVariant.size || !newVariant.title || !newVariant.description) {
      toast.error("Please fill all variant details including title and description");
      return;
    }
    setVariants(prev => [...prev, {
      title: newVariant.title,
      description: newVariant.description,
      price: newVariant.price,
      sellingPrice: newVariant.sellingPrice,
      stock: newVariant.stock,
      attributes: { size: newVariant.size },
      images: newVariant.images // These are File objects
    }]);
    setNewVariant({ price: '', sellingPrice: '', stock: '', title: '', description: '', size: '', images: [] });
    setIsAddingVariant(false);
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isInitialized && !loading) {
      if (!user || user.role !== "seller") {
        navigate("/login");
      }
    }
  }, [user, loading, isInitialized, navigate]);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="heading mb-2">Create Product</h1>
          <p className="subheading">Add a new item to your fitness catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">

          <div className="card space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-4 mb-4">
              <Info size={18} className="text-[var(--color-accent)]" />
              <h2 className="font-bold text-lg">General Information</h2>
            </div>

            <Input
              label="Product Name"
              name="title"
              placeholder="e.g., Impact Training T-Shirt"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows="5"
                className="w-full px-4 py-2.5 bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all duration-300 text-sm resize-none"
                placeholder="Describe the material, fit, and intended use..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Category
              </label>
              <select
                name="category"
                className="w-full px-4 py-2.5 bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all duration-300 text-sm"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="apparel">Apparel</option>
                <option value="supplements">Supplements</option>
                <option value="equipment">Equipment</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Variants Section */}
          <div className="card space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-[var(--color-accent)]" />
                <h2 className="font-bold text-lg">Product Variants</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingVariant(true)}
                className="text-xs font-bold text-[var(--color-accent)] hover:underline"
              >
                + Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {variants.length > 0 ? (
                variants.map((v, idx) => (
                  <div key={idx} className="p-3 bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="text-xs">
                          <span className="text-[var(--text-muted)] uppercase font-bold tracking-tighter mr-1">Title:</span>
                          <span className="font-bold">{v.title}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-[var(--text-muted)] uppercase font-bold tracking-tighter mr-1">Description:</span>
                          <span className="font-bold truncate max-w-[200px] inline-block">{v.description}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-[var(--text-muted)] uppercase font-bold tracking-tighter mr-1">Size:</span>
                          <span className="font-bold">{v.attributes.size}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-[var(--text-muted)] uppercase font-bold tracking-tighter mr-1">Stock:</span>
                          <span className="font-bold">{v.stock}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-[var(--text-muted)] uppercase font-bold tracking-tighter mr-1">Price:</span>
                          <span className="font-bold">{v.price}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-[var(--text-muted)] uppercase font-bold tracking-tighter mr-1">Selling:</span>
                          <span className="font-bold">{v.sellingPrice}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Variant Images Preview */}
                    {v.images?.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {v.images.map((img, i) => (
                          <div key={i} className="w-10 h-10 rounded-lg border border-[var(--border-subtle)] overflow-hidden shrink-0">
                            <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-[var(--border-subtle)] rounded-xl">
                  <p className="text-xs text-[var(--text-muted)]">No variants added. Base details will be used.</p>
                </div>
              )}
            </div>
          </div>

          <div className="card space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-4 mb-4">
              <UploadCloud size={18} className="text-[var(--color-accent)]" />
              <h2 className="font-bold text-lg">Media</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="aspect-square bg-[var(--border-subtle)] rounded-lg relative group overflow-hidden border border-[var(--border-subtle)]">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm hover:bg-red-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label className="aspect-square border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--color-accent)] hover:bg-yellow-500/10 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                <input type="file" className="hidden" multiple onChange={handleImageChange} accept="image/*" />
                <div className="w-10 h-10 rounded-full bg-[var(--border-subtle)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  <Plus size={20} />
                </div>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Add Images</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Form Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card space-y-6 sticky top-24">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-4 mb-4">
              <DollarSign size={18} className="text-[var(--color-accent)]" />
              <h2 className="font-bold text-lg">Pricing</h2>
            </div>

            <div className="space-y-4">
              <Input
                label="MRP (Original Price)"
                name="priceAmount"
                type="number"
                placeholder="0.00"
                value={formData.priceAmount}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Selling Price"
                name="sellingPriceAmount"
                type="number"
                placeholder="0.00"
                value={formData.sellingPriceAmount}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Base Stock"
                name="stock"
                type="number"
                placeholder="Total units if no variants"
                value={formData.stock}
                onChange={handleInputChange}
                required={variants.length === 0}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">Currency</label>
                <select
                  name="priceCurrency"
                  className="w-full px-4 py-2.5 bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all duration-300 text-sm"
                  value={formData.priceCurrency}
                  onChange={handleInputChange}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] space-y-4">
              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Create Product
              </Button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/products')}
                className="w-full text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

      </form>

      {/* Add Variant Modal */}
      {isAddingVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--color-bg)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--color-primary)]">
              <h3 className="font-bold text-lg">Add Product Variant</h3>
              <button
                onClick={() => setIsAddingVariant(false)}
                className="p-2 hover:bg-[var(--border-subtle)] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addVariantToList} className="p-6 space-y-5">
              <Input
                label="Variant Title"
                name="title"
                placeholder="e.g. Red / XL, Limited Edition"
                value={newVariant.title}
                onChange={handleVariantChange}
                required
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">Variant Description</label>
                <textarea
                  name="description"
                  className="w-full px-4 py-2.5 bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:border-[var(--color-accent)] outline-none text-sm transition-all min-h-[100px]"
                  placeholder="Tell more about this variant..."
                  value={newVariant.description}
                  onChange={handleVariantChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="MRP (Original)"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={newVariant.price}
                  onChange={handleVariantChange}
                  required
                />
                <Input
                  label="Selling Price"
                  name="sellingPrice"
                  type="number"
                  placeholder="0.00"
                  value={newVariant.sellingPrice}
                  onChange={handleVariantChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={newVariant.stock}
                  onChange={handleVariantChange}
                  required
                />
                <Input
                  label="Size / Attribute"
                  name="size"
                  placeholder="e.g. XL"
                  value={newVariant.size}
                  onChange={handleVariantChange}
                  required
                />
              </div>

              {/* Variant Image Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--text-primary)]">Variant Images</label>
                <div className="flex flex-wrap gap-2">
                  {newVariant.images.map((img, i) => (
                    <div key={i} className="w-16 h-16 rounded-xl border border-[var(--border-subtle)] relative group overflow-hidden bg-[var(--border-subtle)]">
                      <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeVariantImagePreview(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--color-accent)] flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <input type="file" className="hidden" multiple onChange={handleVariantImageChange} accept="image/*" />
                    <Plus size={16} className="text-[var(--text-muted)]" />
                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase">Upload</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="flex-1">Add Variant</Button>
                <Button type="button" variant="secondary" onClick={() => setIsAddingVariant(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;