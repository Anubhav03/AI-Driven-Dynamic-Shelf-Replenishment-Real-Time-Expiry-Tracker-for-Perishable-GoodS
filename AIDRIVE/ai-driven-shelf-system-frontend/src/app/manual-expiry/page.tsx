'use client';

import ManualExpiryForm from '@/components/ManualExpiryForm';

export default function ManualExpiryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manual Expiry Entry</h1>
        <p className="text-gray-600 mt-2">
          Manually add expiry information for products in your inventory
        </p>
      </div>

      {/* Manual Form */}
      <ManualExpiryForm />
    </div>
  );
} 