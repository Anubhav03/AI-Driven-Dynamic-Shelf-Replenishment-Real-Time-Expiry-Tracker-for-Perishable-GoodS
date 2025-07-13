'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Upload, X, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { useExpiry } from '@/hooks/useExpiry';
import { useProducts } from '@/hooks/useProducts';
import { isValidImageFile, formatFileSize } from '@/utils/helper';

const ocrSchema = z.object({
  product_id: z.number().min(1, 'Please select a product'),
  image: z.any().refine((file) => file && file instanceof File, 'Please select an image file'),
});

type OCRFormData = z.infer<typeof ocrSchema>;

const OCRUploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { scanExpiryImage } = useExpiry();
  const { products, loading: productsLoading } = useProducts();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OCRFormData>({
    resolver: zodResolver(ocrSchema),
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!isValidImageFile(file)) {
        setSubmitError('Please select a valid image file (JPEG, PNG, WebP) under 5MB');
        return;
      }

      setSelectedFile(file);
      setValue('image', file);
      setSubmitError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValue('image', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: OCRFormData) => {
    if (!selectedFile) {
      setSubmitError('Please select an image file');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await scanExpiryImage(data.product_id, selectedFile);
      setSubmitSuccess(true);
      handleRemoveFile();
      reset();
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to scan expiry image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    handleRemoveFile();
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Camera className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">OCR Expiry Scanner</h2>
          <p className="text-sm text-gray-500">Upload an image to automatically detect expiry dates</p>
        </div>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-800 font-medium">Expiry date detected and saved successfully!</span>
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
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center space-y-2 w-full"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 5MB
                </span>
              </button>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    Preview
                  </div>
                </div>
              )}
            </div>
          )}
          
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image.message?.toString()}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || productsLoading || !selectedFile}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Scanning...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Camera className="w-4 h-4 mr-2" />
                Scan Expiry Date
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
        <h3 className="text-sm font-medium text-gray-900 mb-2">OCR Scanning Tips:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Ensure the expiry date is clearly visible in the image</li>
          <li>• Use good lighting and avoid shadows</li>
          <li>• Keep the camera steady and focused</li>
          <li>• Supported formats: JPEG, PNG, WebP (max 5MB)</li>
          <li>• The AI will automatically extract and validate the expiry date</li>
        </ul>
      </div>
    </div>
  );
};

export default OCRUploadForm;