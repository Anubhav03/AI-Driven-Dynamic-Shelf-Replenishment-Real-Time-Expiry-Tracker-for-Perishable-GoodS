'use client';

import OCRUploadForm from '@/components/OCRUploadForm';

export default function ScanExpiryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Scan Expiry</h1>
        <p className="text-gray-600 mt-2">
          Upload product images to automatically detect expiry dates using AI-powered OCR
        </p>
      </div>

      {/* OCR Form */}
      <OCRUploadForm />
    </div>
  );
}