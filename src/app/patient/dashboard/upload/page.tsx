'use client';

import { PatientUploadPortal } from '@/components/patient/PatientUploadPortal';

export default function PatientUploadPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Upload Medical Scan</h1>
          <p className="text-text-secondary mt-2">
            Upload your medical imaging files for AI-powered analysis
          </p>
        </div>
        
        <PatientUploadPortal />
      </div>
    </div>
  );
}