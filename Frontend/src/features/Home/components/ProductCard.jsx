import React from 'react';
import { Trash2, Edit, Tag } from 'lucide-react';

const ProductCard = ({ product, onDelete, onEdit }) => {
  const { _id, title, price, images } = product;
  const mainImage = images?.[0]?.url || 'https://via.placeholder.com/400';

  return (
    <div className="card card-hover p-0 overflow-hidden flex flex-col h-full relative group">
      {/* Visual Component */}
      <div className="aspect-square overflow-hidden relative bg-gray-100">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-gray-900 rounded font-bold text-[10px] uppercase shadow-sm">
          Active
        </div>

        {/* Hover Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit?.(_id)}
            className="w-8 h-8 bg-green-200 text-gray-600 rounded flex items-center justify-center hover:text-[var(--color-accent)] hover:bg-yellow-500 shadow-sm transition-colors"
            title="Edit Product"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete?.(_id)}
            className="w-8 h-8 bg-red-200 text-gray-600 rounded flex items-center justify-center hover:text-white hover:bg-red-700 shadow-sm transition-colors"
            title="Delete Product"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col flex-1 bg-[var(--color-primary)]">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-2">
            <Tag size={12} />
            <span>Category </span>
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-1 line-clamp-2">
            {title}
          </h3>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[var(--text-secondary)]">{price.currency}</span>
            <span className="text-lg font-bold text-[var(--text-primary)] leading-none">
              {price.currency === 'INR' ? '₹' : price.currency === 'USD' ? '$' : price.currency === 'EUR' ? '€' : ''}
              {(price.sellingPrice || price.amount).toLocaleString()}
            </span>
          </div>
          {price.sellingPrice && price.sellingPrice < price.amount && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[var(--text-muted)] line-through">
                {price.currency === 'INR' ? '₹' : price.currency === 'USD' ? '$' : price.currency === 'EUR' ? '€' : ''}
                {price.amount.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-green-500">
                {Math.round(((price.amount - price.sellingPrice) / price.amount) * 100)}% OFF
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
