import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProducts } from "../hooks/use.products";
import {
    X, Plus, Save, Trash2, Package, Tag,
    Info, DollarSign, Layers, Image as ImageIcon,
    ChevronRight, ArrowLeft, Loader2
} from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { toast } from "react-toastify";

export const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductDetails, updateProductBySaller, deleteProductBySaller } = useProducts();
    const { productDetails, loading } = useSelector((state) => state.product);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priceAmount: "",
        sellingPriceAmount: "",
        priceCurrency: "INR",
        category: "apparel"
    });

    const [isAddingVariant, setIsAddingVariant] = useState(false);
    const [editingVariantIndex, setEditingVariantIndex] = useState(null);
    const [newVariant, setNewVariant] = useState({
        price: "",
        sellingPrice: "",
        stock: "",
        title: "",
        description: "",
        size: "",
        images: []
    });

    useEffect(() => {
        if (id) {
            console.log(id)
            getProductDetails(id);
        }
    }, [id]);

    useEffect(() => {
        if (productDetails) {
            setFormData({
                title: productDetails.title || "",
                description: productDetails.description || "",
                priceAmount: productDetails.price?.amount || "",
                sellingPriceAmount: productDetails.price?.sellingPrice || "",
                priceCurrency: productDetails.price?.currency || "INR",
                category: productDetails.category || "apparel"
            });
        }
    }, [productDetails]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (e) => {
        const { name, value } = e.target;
        setNewVariant(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewVariant(prev => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const removeVariantImage = (index) => {
        setNewVariant(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const updateData = new FormData();
            updateData.append("title", formData.title);
            updateData.append("description", formData.description);
            updateData.append("priceAmount", formData.priceAmount);
            updateData.append("sellingPriceAmount", formData.sellingPriceAmount);
            updateData.append("priceCurrency", formData.priceCurrency);
            updateData.append("category", formData.category);

            const response = await updateProductBySaller(id, updateData);
            if (response?.status === "success") {
                toast.success("Product updated successfully");
                getProductDetails(id);
            }
        } catch (error) {
            toast.error("Failed to update product");
        }
    };

    const openEditVariant = (variant, index) => {
        setEditingVariantIndex(index);
        setNewVariant({
            price: variant.price || "",
            sellingPrice: variant.sellingPrice || "",
            stock: variant.stock || "",
            title: variant.title || "",
            description: variant.description || "",
            size: variant.attributes?.size || "",
            images: [] // New images to upload
        });
        setIsAddingVariant(true);
    };

    const handleAddVariant = async (e) => {
        e.preventDefault();
        if (!newVariant.price || !newVariant.sellingPrice || !newVariant.stock || !newVariant.size || !newVariant.title) {
            toast.error("Please fill all variant details including title");
            return;
        }

        try {
            const updateData = new FormData();
            // Send current product details
            updateData.append("title", formData.title);
            updateData.append("description", formData.description);
            updateData.append("priceAmount", formData.priceAmount);
            updateData.append("sellingPriceAmount", formData.sellingPriceAmount);
            updateData.append("priceCurrency", formData.priceCurrency);

            let updatedVariants = [...(productDetails.variants || [])];

            const variantData = {
                title: newVariant.title,
                description: newVariant.description,
                price: newVariant.price,
                sellingPrice: newVariant.sellingPrice,
                stock: newVariant.stock,
                attributes: { size: newVariant.size },
                // Keep existing images if editing
                images: editingVariantIndex !== null ? updatedVariants[editingVariantIndex].images : []
            };

            if (editingVariantIndex !== null) {
                updatedVariants[editingVariantIndex] = variantData;
                updateData.append("editingVariantIndex", editingVariantIndex);
            } else {
                updatedVariants.push(variantData);
            }

            updateData.append("variants", JSON.stringify(updatedVariants));

            newVariant.images.forEach((image) => {
                updateData.append("images", image);
            });

            const response = await updateProductBySaller(id, updateData);
            if (response?.status === "success") {
                toast.success(editingVariantIndex !== null ? "Variant updated successfully" : "Variant added successfully");
                setIsAddingVariant(false);
                setEditingVariantIndex(null);
                setNewVariant({ price: "", sellingPrice: "", stock: "", title: "", description: "", size: "", images: [] });
                getProductDetails(id);
            }
        } catch (error) {
            toast.error(editingVariantIndex !== null ? "Failed to update variant" : "Failed to add variant");
        }
    };

    const handleDeleteVariant = async (index) => {
        if (!window.confirm("Are you sure you want to delete this variant?")) return;

        try {
            const updateData = new FormData();
            updateData.append("title", formData.title);
            updateData.append("description", formData.description);
            updateData.append("priceAmount", formData.priceAmount);
            updateData.append("priceCurrency", formData.priceCurrency);
            updateData.append("category", formData.category);

            const updatedVariants = productDetails.variants.filter((_, i) => i !== index);
            updateData.append("variants", JSON.stringify(updatedVariants));

            const response = await updateProductBySaller(id, updateData);
            if (response?.status === "success") {
                toast.success("Variant deleted successfully");
                getProductDetails(id);
            }
        } catch (error) {
            toast.error("Failed to delete variant");
        }
    };

    const handleDeleteProduct = async () => {
        if (!window.confirm("Are you sure you want to delete this entire product? This action cannot be undone.")) return;

        try {
            const response = await deleteProductBySaller(id);
            if (response?.status === "success") {
                toast.success("Product deleted successfully");
                navigate("/dashboard/products");
            }
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    if (!productDetails && loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent)]" />
            </div>
        );
    }

    if (!productDetails) {
        return (
            <div className="text-center py-20">
                <p className="text-[var(--text-muted)]">Product not found.</p>
                <Button onClick={() => navigate("/dashboard/products")} className="mt-4">
                    Back to Products
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard/products")}
                        className="p-2 hover:bg-[var(--border-subtle)] rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="heading text-2xl mb-1">{productDetails.title}</h1>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                                {productDetails.category}
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">
                                Updated {new Date(productDetails.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setIsAddingVariant(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Variant
                    </Button>
                    <button
                        onClick={handleDeleteProduct}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-all"
                        title="Delete Product"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleUpdateProduct} className="card space-y-6">
                        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-4 mb-4">
                            <Info size={18} className="text-[var(--color-accent)]" />
                            <h2 className="font-bold text-lg">Product Information</h2>
                        </div>

                        <Input
                            label="Product Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-primary)]">Description</label>
                            <textarea
                                name="description"
                                rows="5"
                                className="w-full px-4 py-2.5 bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:border-[var(--color-accent)] outline-none transition-all duration-300 text-sm resize-none"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)]">
                            <Button type="submit" loading={loading} className="flex items-center gap-2">
                                <Save size={18} /> Update Product Details
                            </Button>
                        </div>
                    </form>

                    {/* Variants List */}
                    <div className="card space-y-6">
                        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-4 mb-4">
                            <Layers size={18} className="text-[var(--color-accent)]" />
                            <h2 className="font-bold text-lg">Product Variants</h2>
                        </div>

                        <div className="space-y-4">
                            {productDetails.variants?.length > 0 ? (
                                productDetails.variants.map((variant, idx) => (
                                    <div
                                        key={variant._id || idx}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-primary)] border border-[var(--border-subtle)] hover:border-[var(--color-accent)]/30 transition-all group"
                                    >
                                        {/* Image */}
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--border-subtle)] flex-shrink-0">
                                            {variant.images?.[0] ? (
                                                <img
                                                    src={variant.images[0].url}
                                                    alt="Variant"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                                    <ImageIcon size={20} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Variant Info */}
                                        <div className="flex-grow grid grid-cols-2 md:grid-cols-5 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-tighter text-[var(--text-primary)] font-bold">
                                                    Variant Title
                                                </p>
                                                <p className="text-sm font-semibold truncate max-w-[120px]">
                                                    {variant.title || "Standard"}
                                                </p>
                                            </div>

                                            <div className="hidden md:block">
                                                <p className="text-[10px] uppercase tracking-tighter text-[var(--text-muted)] font-bold">
                                                    Description
                                                </p>
                                                <p className="text-sm font-semibold truncate max-w-[150px]">
                                                    {variant.description || "N/A"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-tighter text-[var(--text-muted)] font-bold">
                                                    Size
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    {variant.attributes?.size || "N/A"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-tighter text-[var(--text-muted)] font-bold">
                                                    Price
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    {productDetails.price?.currency} {variant.sellingPrice || variant.price}
                                                    {variant.sellingPrice && variant.sellingPrice < variant.price && (
                                                        <span className="ml-2 text-[10px] text-[var(--text-muted)] line-through">
                                                            {variant.price}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-tighter text-[var(--text-muted)] font-bold">
                                                    Stock
                                                </p>
                                                <p className="text-sm font-semibold">
                                                    {variant.stock} units
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-end md:pr-4 gap-2">
                                                <button
                                                    onClick={() => handleDeleteVariant(idx)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                                                    title="Delete Variant"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <button
                                                    onClick={() => openEditVariant(variant, idx)}
                                                    className="p-2 hover:bg-[var(--color-primary)] rounded-lg text-[var(--color-accent)] transition-colors flex items-center gap-2"
                                                    title="Edit Variant"
                                                >
                                                    Edit <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-[var(--border-subtle)] rounded-xl">
                                    <p className="text-[var(--text-muted)] text-sm">
                                        No variants added yet.
                                    </p>

                                    <button
                                        onClick={() => setIsAddingVariant(true)}
                                        className="text-[var(--color-accent)] text-sm font-bold mt-2 hover:underline"
                                    >
                                        Add your first variant
                                    </button>

                                </div>
                            )}

                            {productDetails.variants?.length > 0 && (
                                <Button onClick={() => setIsAddingVariant(true)}>
                                    Add Variant
                                </Button>
                            )}
                        </div>
                    </div>


                </div>

                {/* Add Variant Overlay/Form */}
                {isAddingVariant && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-primary)] backdrop-blur-sm animate-fade-in">
                        <div className="bg-[var(--color-background)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
                            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--color-primary)]">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-[var(--text-primary)]">
                                    {editingVariantIndex !== null ? (
                                        <ChevronRight size={20} className="text-[var(--color-accent)]" />
                                    ) : (
                                        <Plus size={20} className="text-[var(--color-accent)]" />
                                    )}
                                    {editingVariantIndex !== null ? "Edit Variant" : "Add New Variant"}
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsAddingVariant(false);
                                        setEditingVariantIndex(null);
                                        setNewVariant({ price: "", sellingPrice: "", stock: "", title: "", description: "", size: "", images: [] });
                                    }}
                                    className="p-2 hover:bg-[var(--border-subtle)] rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAddVariant} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                                {editingVariantIndex !== null && (
                                    <div className="p-3 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-lg text-[var(--color-accent)] text-xs flex items-center gap-2">
                                        <Info size={14} />
                                        <span>Editing an existing variant. Changes will be saved to the product.</span>
                                    </div>
                                )}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="MRP (Original)"
                                        name="price"
                                        type="number"
                                        placeholder="Original price"
                                        value={newVariant.price}
                                        onChange={handleVariantChange}
                                        required
                                    />
                                    <Input
                                        label="Selling Price"
                                        name="sellingPrice"
                                        type="number"
                                        placeholder="Selling price"
                                        value={newVariant.sellingPrice}
                                        onChange={handleVariantChange}
                                        required
                                    />
                                    <Input
                                        label="Stock Quantity"
                                        name="stock"
                                        type="number"
                                        placeholder="Available stock"
                                        value={newVariant.stock}
                                        onChange={handleVariantChange}
                                        required
                                    />
                                    <Input
                                        label="Size / Attribute"
                                        name="size"
                                        placeholder="e.g. XL, 32, Small"
                                        value={newVariant.size}
                                        onChange={handleVariantChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                                        <ImageIcon size={16} /> Variant Images
                                    </label>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                        {newVariant.images.map((img, index) => (
                                            <div key={index} className="aspect-square rounded-lg relative group overflow-hidden border border-[var(--border-subtle)] bg-[var(--border-subtle)]">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariantImage(index)}
                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="aspect-square border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--color-accent)] rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-[var(--color-accent)]/5">
                                            <input type="file" className="hidden" multiple onChange={handleVariantImageChange} accept="image/*" />
                                            <Plus size={20} className="text-[var(--text-muted)]" />
                                            <span className="text-[10px] font-bold text-[var(--text-muted)]">Upload</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-[var(--border-subtle)] flex gap-4">
                                    <Button type="submit" loading={loading} className="flex-grow">
                                        Save Variant
                                    </Button>
                                    <Button type="button" variant="secondary" onClick={() => setIsAddingVariant(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateProduct;