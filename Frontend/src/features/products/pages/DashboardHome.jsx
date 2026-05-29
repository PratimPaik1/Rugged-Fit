import React, { useEffect } from 'react';
import { TrendingUp, Users, Package, DollarSign, Activity } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useProducts } from '../hooks/use.products.js';

const DashboardHome = () => {


  const { products } = useSelector((state) => state.product);
  const { getSellerOrders } = useProducts();

  const { getProducts } = useProducts();

  useEffect(() => {
    getProducts();
    getSellerOrders();
  }, []);

  const { sellerOrders = [] } = useSelector((state) => state.product);

  const validOrders = sellerOrders.filter(o => o.orderStatus !== 'cancelled');
  const totalEarnings = validOrders.reduce((sum, o) => sum + (o.total || o.orderTotal || 0), 0);

  // Recent Activity logic
  const recentOrders = [...sellerOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // in seconds
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // Chart logic (Group by Month for last 6 months)
  const getChartData = () => {
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        label: d.toLocaleString('default', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        revenue: 0
      });
    }

    validOrders.forEach(order => {
      const d = new Date(order.createdAt);
      const target = data.find(item => item.month === d.getMonth() && item.year === d.getFullYear());
      if (target) {
        target.revenue += (order.total || order.orderTotal || 0);
      }
    });

    const maxRevenue = Math.max(...data.map(d => d.revenue), 100); // minimum 100 to avoid division by zero
    return { data, maxRevenue };
  };

  const { data: chartData, maxRevenue } = getChartData();

  const stats = [
    { title: 'Total Revenue', value: `₹${totalEarnings.toLocaleString('en-IN')}`, change: '+12.5%', isPositive: true, icon: <DollarSign size={24} /> },
    { title: 'Total Products', value: products.length, change: '+4.2%', isPositive: true, icon: <Package size={24} /> },
    { title: 'Total Orders', value: sellerOrders.length, change: '+18.1%', isPositive: true, icon: <Activity size={24} /> },
    // { title: 'Active Customers', value: '4,102', change: '-2.4%', isPositive: false, icon: <Users size={24} /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="heading text-3xl mb-2">Overview</h1>
          <p className="subheading">Track your fitness brand performance and store metrics.</p>
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card card-hover smooth">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--border-subtle)] flex items-center justify-center text-[var(--color-accent-secondary)]">
                {stat.icon}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${stat.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="stat-label">{stat.title}</h3>
              <p className="stat-value text-4xl">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts / Lower Section Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Revenue Growth</h3>
            <select className=" px-4 py-2.5 bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all duration-300 text-sm"
            >
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-end gap-2 sm:gap-6 mt-4">
            {chartData.map((point, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center group h-full relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-[var(--text-primary)] text-[var(--color-primary)] text-xs font-bold py-1 px-2 rounded whitespace-nowrap transition-opacity pointer-events-none z-10 shadow-lg">
                  ₹{point.revenue.toLocaleString('en-IN')}
                </div>
                {/* Bar */}
                <div
                  className="w-full bg-[var(--color-accent)]/20 rounded-t-lg group-hover:bg-[var(--color-accent)] transition-all duration-500 relative overflow-hidden flex flex-col justify-end"
                  style={{ height: `${(point.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                >
                  <div className="w-full bg-[var(--color-accent)] absolute bottom-0 opacity-50" style={{ height: '100%' }}></div>
                </div>
                <span className="text-xs font-bold text-[var(--text-secondary)] mt-3 uppercase tracking-wider">{point.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card h-96 flex flex-col">
          <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] text-center mt-10">No recent activity</p>
            ) : (
              recentOrders.map((item) => (
                <div key={item._id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-[var(--border-subtle)]/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] flex-shrink-0">
                    <Package size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      New order #{item._id.substring(item._id.length - 6).toUpperCase()}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs font-medium text-[var(--text-secondary)]">{timeAgo(item.createdAt)}</p>
                      <p className="text-xs font-black text-green-500">₹{(item.total || item.orderTotal || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
