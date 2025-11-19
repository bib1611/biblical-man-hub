'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, DollarSign, ExternalLink, Sparkles } from 'lucide-react';
import { products, categories } from '@/lib/data/products';

export default function ProductsHub() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('name');

  const filteredProducts = products
    .filter((product) => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-950/20 via-black/60 to-blue-950/20 text-gray-100">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-purple-900/30 bg-black/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-purple-100 mb-1">Products Hub</h1>
            <p className="text-sm text-gray-400">
              Biblical tools for transformation. No fluff. Just results.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-400">{products.length}</div>
            <div className="text-xs text-gray-500">Products Available</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 flex-wrap overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? `bg-${category.color}-600/40 text-${category.color}-200 border border-${category.color}-600/50`
                    : 'bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full md:w-auto px-4 py-2 bg-black/60 border border-purple-900/30 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-purple-600/50"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => {
            const categoryInfo = categories.find((c) => c.id === product.category);
            const isTopRated = product.features.some(f => f.includes('5/5'));

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex flex-col p-4 md:p-6 rounded-xl border transition-all md:hover:scale-105 bg-gradient-to-br from-purple-950/30 to-black/40 border-purple-900/30 hover:border-purple-600/50"
              >
                {/* Top Rated Badge */}
                {isTopRated && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                    <Sparkles size={12} />
                    TOP RATED
                  </div>
                )}

                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold bg-${categoryInfo?.color}-600/20 text-${categoryInfo?.color}-400 border border-${categoryInfo?.color}-600/30`}
                  >
                    {categoryInfo?.name}
                  </span>
                  {product.price === 0 ? (
                    <div className="px-3 py-1 bg-green-600/20 border border-green-600/50 rounded-full text-sm font-bold text-green-300">
                      PAY WHAT YOU WANT
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-purple-600/20 border border-purple-600/50 rounded-full text-sm font-bold text-purple-300">
                      ${product.price}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="text-lg font-bold text-purple-100 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-4 flex-1">{product.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Buy Button */}
                <a
                  href={product.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                >
                  <ShoppingCart size={18} />
                  {product.price === 0 ? 'Get Resource' : `Get for $${product.price}`}
                  <ExternalLink
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No products found in this category
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="p-4 border-t border-purple-900/30 bg-gradient-to-r from-purple-900/40 to-blue-900/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-200">
              Need help choosing? Chat with Sam
            </p>
            <p className="text-xs text-gray-400">Get personalized recommendations</p>
          </div>
          <button
            onClick={() => {
              // Open Sam assistant window
              window.dispatchEvent(new CustomEvent('open-window', { detail: 'sam' }));
            }}
            className="px-6 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-600/50 rounded-lg text-sm font-semibold text-blue-200 transition-all"
          >
            Get Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
