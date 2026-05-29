import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { useOrder } from '../hooks/use.order';
import { useSelector } from 'react-redux';

const UserOrders = () => {
    const { getUserOrder } = useOrder()
    const { orders, loading } = useSelector((state) => state.order)

    useEffect(() => {
        getUserOrder();
    }, []);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <Clock size={20} className="text-yellow-500" />;
            case 'processing': return <Package size={20} className="text-blue-500" />;
            case 'shipped': return <Truck size={20} className="text-purple-500" />;
            case 'delivered': return <CheckCircle size={20} className="text-green-500" />;
            default: return <Clock size={20} className="text-gray-500" />;
        }
    };
    console.log(orders)

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-[var(--text-primary)] mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-[var(--color-primary)] rounded-3xl p-12 text-center border border-[var(--border-subtle)] shadow-xl">
                    <Package size={64} className="mx-auto text-[var(--text-muted)] mb-4" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">No orders found</h2>
                    <p className="text-[var(--text-secondary)]">You haven't placed any orders yet. Start exploring our store!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-[var(--color-primary)] rounded-3xl p-6 md:p-8 border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-[var(--border-subtle)] pb-6 mb-6">
                                <div>
                                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">Order ID</p>
                                    <p className="font-mono text-sm text-[var(--text-primary)]">{order._id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">Date</p>
                                    <p className="text-sm font-semibold text-[var(--text-primary)]">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-1">Total</p>
                                    <p className="text-lg font-black text-[var(--color-accent)]">₹{order.orderTotal?.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--border-subtle)] rounded-full h-fit">
                                    {getStatusIcon(order.orderStatus)}
                                    <span className="text-sm font-bold capitalize">{order.orderStatus || 'Pending'}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {order.products?.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--color-background)]">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--color-primary)] border border-[var(--border-subtle)] flex-shrink-0">
                                            <img src={item.info[0].image} alt={item.info.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-[var(--text-primary)] line-clamp-1">{item.info[0].title}</h4>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1">Qty: {item.qty}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-[var(--text-primary)]">₹{item.price?.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {(order.address || order.paymentMode) && (
                                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {order.address && (
                                        <div>
                                            <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-2">Delivery Address</p>
                                            <div className="text-sm text-[var(--text-primary)]">
                                                <p className="font-medium">{order.address.addressLine1}</p>
                                                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                                                <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                            </div>
                                        </div>
                                    )}
                                    {order.paymentMode && (
                                        <div>
                                            <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider mb-2">Payment Method</p>
                                            <p className="text-sm font-medium text-[var(--text-primary)]">
                                                {order.paymentMode === 'COD' ? 'Cash on Delivery' : `${order.paymentMode} (Prepaid)`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserOrders;
