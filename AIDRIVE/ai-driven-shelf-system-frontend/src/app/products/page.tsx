'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  AlertCircle,
  CheckCircle,
  Grid3X3,
  List,
  ShoppingCart,
  Tag,
  BarChart3,
  TrendingUp,
  Star,
  Eye,
  Archive,
  RefreshCw
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Product, ProductCreate, ProductUpdate } from '@/types';
import { isValidBarcode } from '@/utils/helper';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  barcode: z.string().min(1, 'Barcode is required'),
  category: z.string().optional(),
  min_stock: z.number().min(0, 'Minimum stock must be 0 or greater').optional(),
  max_stock: z.number().min(1, 'Maximum stock must be greater than 0').optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'category', 'stock'

  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.barcode.includes(searchTerm);
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'stock':
          return (a.min_stock || 0) - (b.min_stock || 0);
        default:
          return 0;
      }
    });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setValue('name', product.name);
      setValue('barcode', product.barcode);
      setValue('category', product.category || '');
      setValue('min_stock', product.min_stock || 0);
      setValue('max_stock', product.max_stock || 100);
    } else {
      setEditingProduct(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        const updateData: ProductUpdate = {
          name: data.name,
          barcode: data.barcode,
          category: data.category || undefined,
          min_stock: data.min_stock || 0,
          max_stock: data.max_stock || 100,
        };
        await updateProduct(editingProduct.id, updateData);
      } else {
        const createData: ProductCreate = {
          name: data.name,
          barcode: data.barcode,
          category: data.category,
          min_stock: data.min_stock || 0,
          max_stock: data.max_stock || 100,
        };
        await createProduct(createData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const getCategoryColor = (category: string | undefined) => {
    if (!category) return 'bg-gray-100 text-gray-600';
    const colors = {
      'Electronics': 'bg-blue-100 text-blue-800',
      'Food': 'bg-green-100 text-green-800',
      'Clothing': 'bg-purple-100 text-purple-800',
      'Health': 'bg-red-100 text-red-800',
      'Home': 'bg-yellow-100 text-yellow-800',
      'Sports': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getStockStatus = (product: Product) => {
    const minStock = product.min_stock || 0;
    const maxStock = product.max_stock || 100;
    const currentStock = Math.floor(Math.random() * maxStock); // Mock current stock
    
    if (currentStock <= minStock) {
      return { status: 'Low Stock', color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (currentStock >= maxStock * 0.8) {
      return { status: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else {
      return { status: 'Medium Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Product Management</h1>
              <p className="text-blue-100 text-lg">Manage your inventory with smart AI-powered insights</p>
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium">{products.length} Total Products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium">{categories.length} Categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium">Smart Tracking</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <BarChart3 className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-center text-blue-100">AI Analytics Ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search and Filter */}
            <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-gray-50 focus:bg-white min-w-[200px] transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="stock">Sort by Stock</option>
              </select>

              <button
                onClick={() => handleOpenModal()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Products Display */}
        {loading ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <Package className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-600 mt-4 text-lg">Loading your products...</p>
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    {/* Product Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono mt-1">{product.barcode}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Category Badge */}
                      {product.category && (
                        <div className="mb-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                            <Tag className="w-3 h-3 mr-1" />
                            {product.category}
                          </span>
                        </div>
                      )}

                      {/* Stock Status */}
                      <div className={`p-3 rounded-xl ${stockStatus.bgColor} mb-4`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${stockStatus.color}`}>
                            {stockStatus.status}
                          </span>
                          <TrendingUp className={`w-4 h-4 ${stockStatus.color}`} />
                        </div>
                      </div>

                      {/* Stock Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Min Stock:</span>
                          <span className="text-sm font-semibold text-gray-900">{product.min_stock || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Max Stock:</span>
                          <span className="text-sm font-semibold text-gray-900">{product.max_stock || 100}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm === product.id && (
                      <div className="p-4 bg-red-50 border-t border-red-200">
                        <p className="text-sm text-red-800 mb-3 font-medium">Delete this product permanently?</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Product</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Category</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Stock Range</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAndSortedProducts.map((product) => {
                      const stockStatus = getStockStatus(product);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                <Package className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500 font-mono">{product.barcode}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {product.category ? (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                                {product.category}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm text-gray-900">
                              {product.min_stock || 0} - {product.max_stock || 100}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color.replace('text-', 'text-')} ${stockStatus.bgColor}`}>
                              {stockStatus.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleOpenModal(product)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(product.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first product to the inventory'
                }
              </p>
              {!searchTerm && !selectedCategory && (
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Your First Product</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-200"
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Barcode *
                    </label>
                    <input
                      type="text"
                      {...register('barcode')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white font-mono transition-all duration-200"
                      placeholder="Enter barcode"
                    />
                    {errors.barcode && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.barcode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      {...register('category')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-200"
                      placeholder="Enter category (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Min Stock
                      </label>
                      <input
                        type="number"
                        {...register('min_stock', { valueAsNumber: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-200"
                        placeholder="0"
                        min="0"
                      />
                      {errors.min_stock && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.min_stock.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Stock
                      </label>
                      <input
                        type="number"
                        {...register('max_stock', { valueAsNumber: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-200"
                        placeholder="100"
                        min="1"
                      />
                      {errors.max_stock && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.max_stock.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{editingProduct ? 'Updating...' : 'Adding...'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}