'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Package, Save, AlertCircle } from 'lucide-react';
import { useExpiry } from '@/hooks/useExpiry';
import { useProducts } from '@/hooks/useProducts';
import { ManualExpiryCreate } from '@/types';

const expirySchema = z.object({
  product_id: z.number().min(1, 'Please select a product'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
});

type ExpiryFormData = z.infer<typeof expirySchema>;

const ManualExpiryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { addManualExpiry } = useExpiry();
  const { products, loading: productsLoading } = useProducts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpiryFormData>({
    resolver: zodResolver(expirySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onSubmit = async (data: ExpiryFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const expiryData: ManualExpiryCreate = {
        product_id: data.product_id,
        expiry_date: data.expiry_date,
        quantity: data.quantity,
      };

      await addManualExpiry(expiryData);
      setSubmitSuccess(true);
      reset();
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to add expiry data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manual Expiry Entry</h2>
          <p className="text-sm text-gray-500">Add expiry information for products manually</p>
        </div>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Save className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-800 font-medium">Expiry data added successfully!</span>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-800">{submitError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Selection */}
        <div>
          <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-2">
            Product
          </label>
          <select
            id="product_id"
            {...register('product_id', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.product_id ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={productsLoading}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.barcode}
              </option>
            ))}
          </select>
          {errors.product_id && (
            <p className="mt-1 text-sm text-red-600">{errors.product_id.message}</p>
          )}
          {productsLoading && (
            <p className="mt-1 text-sm text-gray-500">Loading products...</p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="date"
            id="expiry_date"
            {...register('expiry_date')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.expiry_date ? 'border-red-300' : 'border-gray-300'
            }`}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.expiry_date && (
            <p className="mt-1 text-sm text-red-600">{errors.expiry_date.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            {...register('quantity', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.quantity ? 'border-red-300' : 'border-gray-300'
            }`}
            min="1"
            placeholder="1"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || productsLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Save className="w-4 h-4 mr-2" />
                Add Expiry Data
              </div>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Select a product from the dropdown list</li>
          <li>• Choose the expiry date (must be in the future)</li>
          <li>• Enter the quantity of items expiring on that date</li>
          <li>• Click "Add Expiry Data" to save the information</li>
          <li>• The system will automatically generate alerts for expiring products</li>
        </ul>
      </div>
    </div>
  );
};

export default ManualExpiryForm;