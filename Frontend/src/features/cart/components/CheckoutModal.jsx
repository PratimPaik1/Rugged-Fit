import React, { useState } from 'react';
import { X, MapPin, Plus, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { useAddress } from '../hooks/use.address';
import { createOrderApi } from '../../order/services/order.api';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useCart } from '../hooks/use.cart';
import { useNavigate } from 'react-router-dom';

const CheckoutModal = ({ isOpen, onClose }) => {
    const { addresses, loading: addressLoading, handleAddAddress } = useAddress();
    const { getCart } = useCart();
    const cartId = useSelector(state => state.cart.cartId);
    const finalAmount = useSelector(state => state.cart.finalAmount);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [paymentMode, setPaymentMode] = useState('COD');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const navigate = useNavigate();

    const [newAddress, setNewAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: ''
    });

    if (!isOpen) return null;

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await createOrderApi({
                cartId,
                addressId: selectedAddressId,
                paymentMode
            });

            if (res.success) {
                toast.success("Order placed successfully!");
                await getCart(); // refresh cart (it should be empty now)
                onClose();
                navigate('/orders'); // navigate to user orders
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddNewAddress = async (e) => {
        e.preventDefault();
        try {
            const added = await handleAddAddress(newAddress);
            if (added) {
                setSelectedAddressId(added._id);
                setShowAddForm(false);
                setNewAddress({ addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
            }
        } catch (err) {
            // Error handled in hook
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--color-primary)] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--color-background)]">
                    <div>
                        <h2 className="text-2xl font-black text-[var(--text-primary)]">Checkout</h2>
                        <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">Complete your order securely</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--border-subtle)] rounded-full transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8">
                    
                    {/* Address Section */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                                <MapPin size={16} className="text-[var(--color-accent)]" /> Delivery Address
                            </h3>
                            {!showAddForm && (
                                <button onClick={() => setShowAddForm(true)} className="text-xs font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1">
                                    <Plus size={14} /> Add New
                                </button>
                            )}
                        </div>

                        {showAddForm ? (
                            <form onSubmit={handleAddNewAddress} className="bg-[var(--border-subtle)]/30 p-5 rounded-2xl border border-[var(--border-subtle)] space-y-4">
                                <div className="space-y-3">
                                    <input required placeholder="Address Line 1" value={newAddress.addressLine1} onChange={e => setNewAddress({...newAddress, addressLine1: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--color-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)]" />
                                    <input placeholder="Address Line 2 (Optional)" value={newAddress.addressLine2} onChange={e => setNewAddress({...newAddress, addressLine2: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--color-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)]" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input required placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--color-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)]" />
                                        <input required placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--color-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)]" />
                                    </div>
                                    <input required placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--color-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)]" />
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
                                    <button type="submit" disabled={addressLoading} className="px-6 py-2 bg-[var(--color-accent)] text-black rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-all">Save Address</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {addresses.map(addr => (
                                    <div 
                                        key={addr._id} 
                                        onClick={() => setSelectedAddressId(addr._id)}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative ${selectedAddressId === addr._id ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-[var(--border-subtle)] hover:border-[var(--color-accent)]/50'}`}
                                    >
                                        {selectedAddressId === addr._id && (
                                            <div className="absolute top-3 right-3 w-5 h-5 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-black">
                                                <ShieldCheck size={12} />
                                            </div>
                                        )}
                                        <p className="font-bold text-sm mb-1 line-clamp-1 pr-6">{addr.addressLine1}</p>
                                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{addr.addressLine2}</p>
                                        <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">{addr.city}, {addr.state} - {addr.pincode}</p>
                                    </div>
                                ))}
                                {addresses.length === 0 && !addressLoading && (
                                    <div className="col-span-full py-8 text-center bg-[var(--border-subtle)]/20 rounded-2xl border border-dashed border-[var(--border-subtle)]">
                                        <p className="text-sm text-[var(--text-secondary)] mb-3">No addresses saved yet</p>
                                        <button onClick={() => setShowAddForm(true)} className="px-5 py-2 bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-xl text-sm font-bold shadow-sm hover:border-[var(--color-accent)] transition-all">Add Address</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Payment Section */}
                    <section className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                            <CreditCard size={16} className="text-green-500" /> Payment Method
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: 'COD', label: 'Cash on Delivery', icon: Banknote },
                                { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
                                { id: 'UPI', label: 'UPI Payment', icon: ShieldCheck }
                            ].map(mode => (
                                <div 
                                    key={mode.id}
                                    onClick={() => setPaymentMode(mode.id)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center ${paymentMode === mode.id ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-[var(--border-subtle)] hover:border-[var(--color-accent)]/50'}`}
                                >
                                    <mode.icon size={24} className={paymentMode === mode.id ? 'text-[var(--color-accent)]' : 'text-[var(--text-muted)]'} />
                                    <span className={`text-xs font-bold ${paymentMode === mode.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{mode.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--color-background)] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-xs text-[var(--text-secondary)] uppercase font-bold tracking-wider">Total to Pay</p>
                        <p className="text-2xl font-black text-[var(--color-accent)]">₹{finalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <button 
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting || !selectedAddressId || showAddForm}
                        className="w-full sm:w-auto px-10 py-4 bg-[var(--color-accent)] text-black rounded-2xl font-extrabold text-base shadow-xl shadow-[var(--color-accent)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                        ) : (
                            <ShieldCheck size={20} />
                        )}
                        {isSubmitting ? 'Processing...' : 'Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
