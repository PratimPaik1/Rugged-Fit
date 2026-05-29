import React, { useEffect, useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertCircle,
  Archive,
  XCircle,
  FileText,
  Printer
} from 'lucide-react';
import { useProducts } from '../hooks/use.products.js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const getStatusBadge = (status) => {
  const normalizedStatus = (status || '').toLowerCase();
  switch (normalizedStatus) {
    case 'pending':
      return (
        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <Clock size={12} className="animate-pulse" /> Pending
        </span>
      );
    case 'packed':
      return (
        <span className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <Archive size={12} /> Packed
        </span>
      );
    case 'shipped':
      return (
        <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <Truck size={12} /> Shipped
        </span>
      );
    case 'delivered':
      return (
        <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-500 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <CheckCircle size={12} /> Delivered
        </span>
      );
    case 'cancelled':
      return (
        <span className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-500 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <XCircle size={12} /> Cancelled
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 bg-[var(--border-subtle)] text-[var(--text-secondary)] rounded-full text-xs font-bold w-fit">
          {status}
        </span>
      );
  }
};

// Internal icon for pending fallback
const Clock = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SellerOrders = () => {
  const { getSellerOrders, updateOrderStatusBySeller } = useProducts();
  const { sellerOrders = [], loading } = useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getSellerOrders();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getSellerOrders();
      toast.success("Orders synchronized with server");
    } catch (error) {
      toast.error("Failed to sync orders");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDownloadBill = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Popup blocker prevented opening the invoice. Please enable popups.");
      return;
    }

    const firstProduct = order.products?.[0] || {};
    const formattedDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      : 'N/A';

    const buyerName = order.buyer?.fullname || 'Valued Customer';
    const buyerEmail = order.buyer?.email || 'customer@ruggedfit.com';
    const buyerContact = order.buyer?.contact || '+91 XXXXX XXXXX';
    const buyerAddress = order.buyerAddress
      ? `${order.buyerAddress.addressLine1}, ${order.buyerAddress.addressLine2}, ${order.buyerAddress.city}, ${order.buyerAddress.state} - ${order.buyerAddress.pincode}`
      : 'Standard Domestic Delivery, Zone A-12';

    const sellerName = order.seller?.fullname || 'IronThread Seller';
    const sellerEmail = order.seller?.email || 'seller@ironthread.com';
    const sellerContact = order.seller?.contact || '+91 XXXXX XXXXX';

    const productsHtml = order.products?.map((item, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; text-align: center; color: #4a5568;">${idx + 1}</td>
        <td style="padding: 12px; font-weight: 600; color: #1a202c;">${item.productTitle || 'Product'}</td>
        <td style="padding: 12px; text-align: center; color: #4a5568;">${item.qty}</td>
        <td style="padding: 12px; text-align: right; color: #4a5568;">₹${item.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td style="padding: 12px; text-align: right; color: #4a5568;">₹${(item.lineTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('') || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.orderId || order._id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #2d3748;
              margin: 0;
              padding: 40px;
              background-color: #ffffff;
            }
            .invoice-card {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .logo-text {
              font-size: 28px;
              font-weight: 800;
              letter-spacing: -1px;
              color: #FACC15;
            }
            .invoice-title {
              font-size: 22px;
              font-weight: 800;
              text-align: right;
              color: #1a202c;
              letter-spacing: 1px;
            }
            .meta-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              background-color: #f8fafc;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .meta-cell {
              padding: 16px;
              width: 25%;
              vertical-align: top;
            }
            .meta-label {
              font-size: 10px;
              text-transform: uppercase;
              font-weight: 700;
              color: #64748b;
              margin-bottom: 4px;
            }
            .meta-val {
              font-size: 13px;
              font-weight: 600;
              color: #0f172a;
            }
            .address-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .address-cell {
              width: 50%;
              vertical-align: top;
              padding: 0 15px 0 0;
            }
            .address-title {
              font-size: 11px;
              text-transform: uppercase;
              font-weight: 800;
              color: #4f46e5;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 6px;
              margin-bottom: 10px;
              letter-spacing: 0.5px;
            }
            .address-name {
              font-size: 15px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 4px;
            }
            .address-detail {
              font-size: 12px;
              color: #475569;
              line-height: 1.6;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .items-th {
              background-color: #f1f5f9;
              color: #475569;
              font-size: 11px;
              text-transform: uppercase;
              font-weight: 700;
              padding: 12px;
              border-bottom: 2px solid #cbd5e1;
            }
            .summary-table {
              width: 320px;
              margin-left: auto;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .summary-row td {
              padding: 8px 12px;
              font-size: 13px;
            }
            .summary-label {
              color: #64748b;
            }
            .summary-val {
              text-align: right;
              font-weight: 600;
              color: #0f172a;
            }
            .grand-total {
              border-top: 2px double #cbd5e1;
              font-size: 16px !important;
              font-weight: 800 !important;
              color: #4f46e5 !important;
            }
            .footer {
              text-align: center;
              margin-top: 60px;
              font-size: 11px;
              color: #94a3b8;
              border-top: 1px dashed #e2e8f0;
              padding-top: 20px;
            }
            @media print {
              body {
                padding: 0;
              }
              .invoice-card {
                padding: 0;
              }
              @page {
                size: auto;
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <!-- Header -->
            <table class="header-table">
              <tr>
                <td class="logo-text">RuggedFit</td>
                <td class="invoice-title">TAX INVOICE</td>
              </tr>
            </table>

            <!-- Meta Details -->
            <table class="meta-table">
              <tr>
                <td class="meta-cell">
                  <div class="meta-label">Invoice No</div>
                  <div class="meta-val">INV-${order._id.substring(0, 10).toUpperCase()}</div>
                </td>
                <td class="meta-cell">
                  <div class="meta-label">Order ID</div>
                  <div class="meta-val">#${order.orderId?.substring(0, 12).toUpperCase() || order._id.substring(0, 12).toUpperCase()}</div>
                </td>
                <td class="meta-cell">
                  <div class="meta-label">Date Generated</div>
                  <div class="meta-val">${formattedDate}</div>
                </td>
                <td class="meta-cell">
                  <div class="meta-label">Payment Mode</div>
                  <div class="meta-val">${order.paymentMode === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMode + ' (Prepaid)'}</div>
                </td>
              </tr>
            </table>

            <!-- Address Block -->
            <table class="address-table">
              <tr>
                <td class="address-cell">
                  <div class="address-title">SOLD BY (SELLER)</div>
                  <div class="address-name">${sellerName}</div>
                  <div class="address-detail">
                    Email: ${sellerEmail}<br/>
                    Phone: ${sellerContact}<br/>
                    Hub: IronThread Fulfillment Center B-2
                  </div>
                </td>
                <td class="address-cell">
                  <div class="address-title">DELIVER TO (BUYER)</div>
                  <div class="address-name">${buyerName}</div>
                  <div class="address-detail">
                    Email: ${buyerEmail}<br/>
                    Phone: ${buyerContact}<br/>
                    Shipping Address: ${buyerAddress}
                  </div>
                </td>
              </tr>
            </table>

            <!-- Items Table -->
            <table class="items-table">
              <thead>
                <tr>
                  <th class="items-th" style="width: 8%; text-align: center;">S.No</th>
                  <th class="items-th" style="text-align: left;">Product Item</th>
                  <th class="items-th" style="width: 10%; text-align: center;">Qty</th>
                  <th class="items-th" style="width: 20%; text-align: right;">Unit Price</th>
                  <th class="items-th" style="width: 20%; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
            </table>

            <!-- Summary Table -->
            <table class="summary-table">
              <tr class="summary-row">
                <td class="summary-label">Subtotal</td>
                <td class="summary-val">₹${(order.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr class="summary-row">
                <td class="summary-label">Estimated GST (18%)</td>
                <td class="summary-val">₹${(order.totalTaxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr class="summary-row">
                <td class="summary-label">Shipping Charges</td>
                <td class="summary-val">₹${(order.shippingCharge || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr class="summary-row">
                <td class="summary-label grand-total">Total Paid</td>
                <td class="summary-val grand-total">₹${(order.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </table>

            <!-- Footer -->
            <div class="footer">
              This is a computer-generated tax invoice and does not require a physical signature.<br/>
              Thank you for shopping with RuggedFit!
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const handleDownloadLabel = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Popup blocker prevented opening the label. Please enable popups.");
      return;
    }

    const firstProduct = order.products?.[0] || {};
    const formattedDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      : 'N/A';

    const buyerName = order.buyer?.fullname || 'Valued Customer';
    const buyerEmail = order.buyer?.email || 'customer@ironthread.com';
    const buyerContact = order.buyer?.contact || '+91 XXXXX XXXXX';
    const buyerAddress = order.buyerAddress
      ? `${order.buyerAddress.addressLine1}, ${order.buyerAddress.addressLine2}, ${order.buyerAddress.city}, ${order.buyerAddress.state} - ${order.buyerAddress.pincode}`
      : 'Standard Express Zone A-12, Sector 4';

    const sellerName = order.seller?.fullname || 'IronThread Seller';
    const sellerContact = order.seller?.contact || '+91 XXXXX XXXXX';

    const totalQty = order.products?.reduce((sum, item) => sum + item.qty, 0) || 0;

    let svgContent = '';
    let currentX = 10;
    for (let i = 0; i < 48; i++) {
      const widths = [1.5, 3, 4.5, 6, 1.5, 3, 6, 1.5, 4.5, 3];
      const w = widths[i % widths.length];
      const gap = (i % 3 === 0) ? 4.5 : 1.5;
      svgContent += `<rect x="${currentX}" y="0" width="${w}" height="50" fill="#000000" />`;
      currentX += w + gap;
    }
    const svgBarcode = `
      <svg width="${currentX + 10}" height="50" viewBox="0 0 ${currentX + 10} 50" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
        ${svgContent}
      </svg>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shipping Label - ${order.orderId || order._id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #000000;
              margin: 0;
              padding: 20px;
              background-color: #ffffff;
            }
            .label-border {
              width: 380px;
              border: 3px solid #000000;
              padding: 16px;
              box-sizing: border-box;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000000;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .header-logo {
              font-size: 20px;
              font-weight: 900;
              letter-spacing: -0.5px;
            }
            .header-sub {
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 2px;
              margin-top: 2px;
            }
            .barcode-container {
              text-align: center;
              padding: 8px 0;
              border-bottom: 2px solid #000000;
              margin-bottom: 12px;
            }
            .tracking-text {
              font-family: monospace;
              font-size: 12px;
              font-weight: bold;
              margin-top: 4px;
            }
            .section {
              border-bottom: 1px solid #000000;
              padding-bottom: 8px;
              margin-bottom: 8px;
            }
            .section:last-child {
              border-bottom: none;
              padding-bottom: 0;
              margin-bottom: 0;
            }
            .section-title {
              font-size: 9px;
              font-weight: 800;
              color: #4a5568;
              margin-bottom: 4px;
              letter-spacing: 0.5px;
            }
            .info-name {
              font-size: 14px;
              font-weight: 800;
              margin-bottom: 2px;
            }
            .info-detail {
              font-size: 11px;
              line-height: 1.4;
            }
            .badge {
              border: 2px solid #000000;
              font-size: 16px;
              font-weight: 900;
              text-align: center;
              padding: 6px;
              margin-top: 6px;
            }
            @media print {
              body {
                padding: 0;
              }
              .label-border {
                border-width: 3px !important;
              }
              @page {
                size: 100mm 150mm;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="label-border">
            <div class="header">
              <div class="header-logo">RuggedFit LOGISTICS</div>
              <div class="header-sub">STANDARD AIR EXPRESS</div>
            </div>

            <div class="barcode-container">
              ${svgBarcode}
              <div class="tracking-text">IT-TRK-${order._id.substring(0, 14).toUpperCase()}</div>
            </div>

            <div class="section">
              <div class="section-title">SHIP TO:</div>
              <div class="info-name">${buyerName}</div>
              <div class="info-detail">
                <strong>Address:</strong> ${buyerAddress}<br/>
                <strong>Email:</strong> ${buyerEmail}<br/>
                <strong>Phone:</strong> ${buyerContact}
              </div>
            </div>

            <div class="section">
              <div class="section-title">SHIP FROM:</div>
              <div class="info-name">${sellerName}</div>
              <div class="info-detail">
                Phone: ${sellerContact}<br/>
                Fulfillment Hub: RuggedFit Hub IND-BLR
              </div>
            </div>

            <div class="section" style="border-bottom: none;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 50%; vertical-align: top;">
                    <div class="section-title">ORDER DETAILS:</div>
                    <div style="font-size: 10px; line-height: 1.3;">
                      <strong>Order ID:</strong> #${order.orderId?.substring(0, 10).toUpperCase() || order._id.substring(0, 10).toUpperCase()}<br/>
                      <strong>Date:</strong> ${formattedDate}<br/>
                      <strong>Items Qty:</strong> ${totalQty} unit(s)<br/>
                      <strong>Weight:</strong> 0.45 KG
                    </div>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                    <div class="badge">
                      ZONE BLR-S2
                    </div>
                    <div style="font-size: 8px; font-weight: bold; text-align: center; margin-top: 4px; letter-spacing: 0.5px;">
                      D-ROUTE #48
                    </div>
                  </td>
                </tr>
              </table>
            </div>

          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const handleStatusUpdate = async (e, orderId, newStatus) => {
    e.stopPropagation(); // Avoid triggering card/row expand
    setUpdatingId(orderId);
    try {
      const data = await updateOrderStatusBySeller(orderId, newStatus);
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const copyToClipboard = (e, text, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.info("Copied ID to clipboard");
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Calculations for Stats Card
  const activeOrders = sellerOrders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
  const totalEarnings = sellerOrders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Filtering Logic
  const filteredOrders = sellerOrders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

    const searchLower = searchTerm.toLowerCase();
    const matchesId = order.orderId?.toLowerCase().includes(searchLower) || order._id?.toLowerCase().includes(searchLower);
    const matchesProduct = order.products?.some(p => p.productTitle?.toLowerCase().includes(searchLower));

    return matchesStatus && (matchesId || matchesProduct);
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="heading text-3xl font-extrabold tracking-tight mb-2">Order Fulfillment</h1>
          <p className="subheading text-[var(--text-secondary)]">Manage customer orders, track fulfillment states, and review details.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="btn-secondary flex items-center gap-2 px-4 py-2 border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--border-subtle)] transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw size={16} className={`${isRefreshing || (loading && sellerOrders.length === 0) ? 'animate-spin text-[var(--color-accent)]' : ''}`} />
          {isRefreshing ? 'Syncing...' : 'Sync Orders'}
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Orders Card */}
        <div className="card p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--border-subtle)]/30 backdrop-blur-md flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Total Orders</p>
            <h3 className="text-3xl font-black text-[var(--color-accent)]">{sellerOrders.length}</h3>
            <p className="text-xs text-[var(--text-secondary)]">Lifetime orders received</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>

        {/* Active Orders Card */}
        <div className="card p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--border-subtle)]/30 backdrop-blur-md flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Active Orders</p>
            <h3 className="text-3xl font-black text-yellow-500">{activeOrders.length}</h3>
            <p className="text-xs text-[var(--text-secondary)]">Orders in process</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>

        {/* Revenue Card */}
        <div className="card p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--border-subtle)]/30 backdrop-blur-md flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Total Revenue</p>
            <h3 className="text-3xl font-black text-green-500">₹{totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-[var(--text-secondary)]">Excluding cancelled orders</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="card border border-[var(--border-subtle)] bg-[var(--color-primary)] rounded-2xl p-6 shadow-sm">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input
              type="text"
              placeholder="Search by Order ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--border-subtle)]/50 border border-[var(--border-subtle)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-accent)] transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['all', 'pending', 'packed', 'shipped', 'delivered', 'cancelled'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${statusFilter === filter
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-sm'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--border-subtle)]'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && sellerOrders.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-[var(--border-subtle)] rounded-xl p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-1/4 bg-[var(--border-subtle)] rounded" />
                  <div className="h-6 w-20 bg-[var(--border-subtle)] rounded" />
                </div>
                <div className="h-10 w-full bg-[var(--border-subtle)] rounded" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] animate-bounce">
              <Package size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">No Orders Found</h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                We couldn't find any orders matching your selection. Try clearing search keywords or selecting a different status filter.
              </p>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const hasMultipleProducts = order.products && order.products.length > 1;
              const firstProduct = order.products?.[0] || {};
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
                : 'Date not available';

              return (
                <div
                  key={order._id}
                  className={`border border-[var(--border-subtle)] rounded-xl overflow-hidden transition-all duration-300 ${isExpanded
                    ? 'shadow-md border-[var(--color-accent)] bg-[var(--border-subtle)]/5'
                    : 'hover:border-[var(--color-accent-secondary)] bg-transparent'
                    }`}
                >
                  {/* Order Summary Row */}
                  <div
                    onClick={() => toggleExpand(order._id)}
                    className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    {/* Primary Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase font-extrabold text-[var(--text-secondary)] tracking-wider">
                            Order
                          </span>
                          <span className="font-mono text-sm font-bold text-[var(--color-accent-secondary)]">
                            #{order.orderId?.substring(0, 8) || order._id?.substring(0, 8)}...
                          </span>
                          <button
                            onClick={(e) => copyToClipboard(e, order.orderId || order._id, order._id)}
                            className="p-1 hover:bg-[var(--border-subtle)] rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                            title="Copy full Order ID"
                          >
                            {copiedId === order._id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <Calendar size={12} />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Preview */}
                    <div className="flex items-center gap-3 w-full lg:w-1/3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--border-subtle)] flex-shrink-0">
                        {firstProduct.productImage ? (
                          <img
                            src={firstProduct.productImage}
                            alt={firstProduct.productTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {firstProduct.productTitle || 'Unknown Product'}
                        </p>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider">
                          Qty: {firstProduct.qty} {hasMultipleProducts && `+ ${order.products.length - 1} more item(s)`}
                        </p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase font-extrabold tracking-wider">Total Value</p>
                      <p className="font-extrabold text-sm text-[var(--text-primary)]">
                        ₹{order.total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Badges & Actions */}
                    <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[var(--border-subtle)]">
                      <div>
                        {getStatusBadge(order.orderStatus)}
                      </div>

                      {/* Dropdown status update */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <select
                          disabled={updatingId === order._id}
                          value={order.orderStatus?.toLowerCase() || 'pending'}
                          onChange={(e) => handleStatusUpdate(e, order._id, e.target.value)}
                          className="pl-3 pr-8 py-1.5 bg-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold focus:outline-none focus:border-[var(--color-accent)] transition-all cursor-pointer disabled:opacity-50 appearance-none text-[var(--text-primary)]"
                        >
                          <option value="pending">Pending</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown
                          size={12}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                        />
                      </div>

                      <div>
                        {isExpanded ? <ChevronUp size={18} className="text-[var(--text-secondary)]" /> : <ChevronDown size={18} className="text-[var(--text-secondary)]" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-[var(--border-subtle)] bg-[var(--border-subtle)]/10 animate-fade-in">
                      <div className="py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Products Table */}
                        <div className="lg:col-span-2 space-y-3">
                          <h4 className="text-xs uppercase font-extrabold text-[var(--text-secondary)] tracking-wider">
                            Order Items
                          </h4>
                          <div className="space-y-2">
                            {order.products?.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center justify-between p-3 bg-[var(--color-primary)] rounded-lg border border-[var(--border-subtle)]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-md overflow-hidden bg-[var(--border-subtle)] flex-shrink-0">
                                    {item.productImage ? (
                                      <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                        <Package size={18} />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold line-clamp-1">{item.productTitle}</p>
                                    <p className="text-[10px] text-[var(--text-secondary)]">
                                      ₹{item.price?.toLocaleString('en-IN')} each
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black">₹{item.lineTotal?.toLocaleString('en-IN')}</p>
                                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                                    Qty: {item.qty}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Calculation Summary */}
                        <div className="space-y-4 bg-[var(--color-primary)] p-4 rounded-xl border border-[var(--border-subtle)] h-fit">
                          <h4 className="text-xs uppercase font-extrabold text-[var(--text-secondary)] tracking-wider border-b border-[var(--border-subtle)] pb-2">
                            Financial Breakdown
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-[var(--text-secondary)]">Subtotal:</span>
                              <span className="font-semibold">₹{order.subtotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[var(--text-secondary)]">Shipping:</span>
                              <span className="font-semibold">₹{order.shippingCharge?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[var(--text-secondary)]">Tax Rate:</span>
                              <span className="font-semibold">{order.taxRate}% GST</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[var(--text-secondary)]">Estimated GST Amount:</span>
                              <span className="font-semibold">₹{order.totalTaxAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="border-t border-[var(--border-subtle)] pt-2 flex justify-between font-extrabold text-sm text-[var(--color-accent)]">
                              <span>Total Payout:</span>
                              <span>₹{order.total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>

                          {/* Inner Alert or Policy */}
                          <div className="p-3 bg-[var(--border-subtle)]/40 rounded-lg text-[10px] text-[var(--text-secondary)] flex items-start gap-2">
                            <AlertCircle size={14} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                            <span>
                              Payout totals include estimated GST breakdown based on the regional 18% tax standard. Shipping charges are applied if subtotal is below ₹1000.
                            </span>
                          </div>

                          {/* Fulfillment Documents Downloads */}
                          <div className="border-t border-[var(--border-subtle)] pt-4 mt-2 space-y-3">
                            <h5 className="text-[10px] text-[var(--text-secondary)] uppercase font-extrabold tracking-wider">Fulfillment Documents</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleDownloadBill(order)}
                                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white rounded-lg text-xs font-bold transition-all duration-300 border border-[var(--color-accent)]/20 cursor-pointer"
                              >
                                <FileText size={14} /> Bill (Invoice)
                              </button>
                              <button
                                onClick={() => handleDownloadLabel(order)}
                                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary)] hover:text-white rounded-lg text-xs font-bold transition-all duration-300 border border-[var(--color-accent-secondary)]/20 cursor-pointer"
                              >
                                <Printer size={14} /> Shipping Label
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
