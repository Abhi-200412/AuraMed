'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, User, Activity, AlertTriangle, CheckCircle, Brain, HeartPulse, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DiagnosticAssistantChat } from '@/components/doctor/DiagnosticAssistantChat';
import { X } from 'lucide-react';

interface AnalysisResult {
  anomalyDetected: boolean;
  confidenceScore: number;
  findings: string;
  severity: 'low' | 'medium' | 'high' | 'none';
  recommendations: string[];
  heatmapAreas?: string[];
  detailedAnalysis?: {
    primaryCondition: string;
    differentialDiagnoses: { condition: string; probability: number }[];
    affectedOrganSystem: string;
    urgencyLevel: string;
  };
  technicalDetails?: {
    processingTime: number;
    fileSize: number;
    modelType: string;
  };
}

interface PatientInfo {
  name: string;
  age: number;
  contact: string;
  email: string;
  address?: string;
  medicalHistory?: string[];
  fileName: string;
  uploadDate: string;
}

export default function DoctorAnalyzePage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Load analysis result and patient info from localStorage
    const storedAnalysis = localStorage.getItem('latestDoctorAnalysis');
    const storedPatientInfo = localStorage.getItem('patientInfo');

    if (storedAnalysis) {
      setAnalysisResult(JSON.parse(storedAnalysis));
    }

    if (storedPatientInfo) {
      setPatientInfo(JSON.parse(storedPatientInfo));
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text-primary p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (!analysisResult || !patientInfo) {
    return (
      <div className="min-h-screen bg-background text-text-primary p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-xl p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">No Analysis Data Found</h2>
            <p className="text-text-secondary mb-6">
              Please upload and analyze a medical scan first.
            </p>
            <button
              onClick={() => router.push('/doctor/dashboard/upload')}
              className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition-all"
            >
              Upload Scan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">Analysis Report</h1>
          <p className="text-text-secondary mt-2">
            Detailed results of the medical image analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-6 lg:col-span-1 h-fit"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-secondary">Name</p>
                <p className="font-semibold">{patientInfo.name}</p>
              </div>

              <div>
                <p className="text-sm text-text-secondary">Age</p>
                <p className="font-semibold">{patientInfo.age} years</p>
              </div>

              <div>
                <p className="text-sm text-text-secondary">Contact</p>
                <p className="font-semibold">{patientInfo.contact}</p>
              </div>

              <div>
                <p className="text-sm text-text-secondary">Email</p>
                <p className="font-semibold">{patientInfo.email}</p>
              </div>

              <div>
                <p className="text-sm text-text-secondary">File Analyzed</p>
                <p className="font-semibold">{patientInfo.fileName}</p>
              </div>

              <div>
                <p className="text-sm text-text-secondary">Upload Date</p>
                <p className="font-semibold">
                  {new Date(patientInfo.uploadDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-secondary">Medical History</p>
                <p className="font-semibold">
                  {patientInfo.medicalHistory && patientInfo.medicalHistory.length > 0
                    ? patientInfo.medicalHistory.join(', ')
                    : 'No significant medical history'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                {analysisResult.anomalyDetected ? (
                  <div className={`p-3 rounded-full ${analysisResult.severity === 'high'
                    ? 'bg-red-500/20'
                    : analysisResult.severity === 'medium'
                      ? 'bg-yellow-500/20'
                      : 'bg-green-500/20'
                    }`}>
                    <Activity className={`w-6 h-6 ${analysisResult.severity === 'high'
                      ? 'text-red-400'
                      : analysisResult.severity === 'medium'
                        ? 'text-yellow-400'
                        : 'text-green-400'
                      }`} />
                  </div>
                ) : (
                  <div className="p-3 rounded-full bg-green-500/20">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">
                    {analysisResult.anomalyDetected ? 'Anomaly Detected' : 'No Anomalies Detected'}
                  </h2>
                  <p className="text-text-secondary">
                    Confidence: {analysisResult.confidenceScore}%
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Severity Badge */}
                {analysisResult.anomalyDetected && (
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${analysisResult.severity === 'high'
                    ? 'bg-red-500/20 border border-red-500/50'
                    : analysisResult.severity === 'medium'
                      ? 'bg-yellow-500/20 border border-yellow-500/50'
                      : 'bg-green-500/20 border border-green-500/50'
                    }`}>
                    <span className={`font-semibold ${analysisResult.severity === 'high'
                      ? 'text-red-300'
                      : analysisResult.severity === 'medium'
                        ? 'text-yellow-300'
                        : 'text-green-300'
                      }`}>
                      Severity: {analysisResult.severity.toUpperCase()}
                      {analysisResult.severity === 'high' && ' - Urgent'}
                      {analysisResult.severity === 'medium' && ' - Monitor'}
                      {analysisResult.severity === 'low' && ' - Routine'}
                    </span>
                  </div>
                )}

                {/* Detailed Analysis Section */}
                {analysisResult.detailedAnalysis && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface-light/50 p-4 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <Brain size={18} />
                        <h4 className="font-semibold">Primary Condition</h4>
                      </div>
                      <p className="font-medium text-lg">{analysisResult.detailedAnalysis.primaryCondition}</p>
                    </div>
                    <div className="bg-surface-light/50 p-4 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-secondary">
                        <HeartPulse size={18} />
                        <h4 className="font-semibold">Affected System</h4>
                      </div>
                      <p className="font-medium text-lg">{analysisResult.detailedAnalysis.affectedOrganSystem}</p>
                    </div>

                    {/* Urgency Indicator */}
                    <div className={`col-span-1 md:col-span-2 p-4 rounded-lg border ${analysisResult.detailedAnalysis.urgencyLevel === 'Immediate Action'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-surface-light/50 border-white/5'
                      }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity size={18} className={analysisResult.detailedAnalysis.urgencyLevel === 'Immediate Action' ? 'text-red-400' : 'text-text-secondary'} />
                        <h4 className="font-semibold">Recommended Action</h4>
                      </div>
                      <p className={`font-medium text-lg ${analysisResult.detailedAnalysis.urgencyLevel === 'Immediate Action' ? 'text-red-300' : ''}`}>
                        {analysisResult.detailedAnalysis.urgencyLevel}
                      </p>
                    </div>
                  </div>
                )}

                {/* Heatmap Areas */}
                {analysisResult.heatmapAreas && analysisResult.heatmapAreas.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Activity size={18} className="text-primary" />
                      Regions of Interest (ROI)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.heatmapAreas.map((area, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Findings */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Detailed Findings:</h3>
                  <p className="text-text-secondary leading-relaxed bg-surface-light/50 p-4 rounded-lg border border-white/5">
                    {analysisResult.findings}
                  </p>
                </div>

                {/* Differential Diagnosis */}
                {analysisResult.detailedAnalysis?.differentialDiagnoses && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Stethoscope size={18} className="text-primary" />
                      Differential Diagnosis
                    </h3>
                    <div className="space-y-3">
                      {analysisResult.detailedAnalysis.differentialDiagnoses.map((diag, idx) => (
                        <div key={idx} className="bg-surface-light/30 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{diag.condition}</span>
                            <span className="text-sm text-text-secondary">{diag.probability}% Probability</span>
                          </div>
                          <div className="w-full bg-surface-light rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${diag.probability}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Clinical Recommendations:</h3>
                    <ul className="space-y-2">
                      {analysisResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-text-secondary bg-surface-light/50 p-3 rounded-lg border border-white/5">
                          <span className="text-primary mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Details */}
                {analysisResult.technicalDetails && (
                  <div className="border-t border-border/30 pt-4">
                    <h3 className="font-semibold text-lg mb-3">Technical Details:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-surface-light/50 p-3 rounded-lg border border-white/5">
                        <p className="text-sm text-text-secondary">Processing Time</p>
                        <p className="font-semibold">
                          {(analysisResult.technicalDetails.processingTime / 1000).toFixed(2)}s
                        </p>
                      </div>
                      <div className="bg-surface-light/50 p-3 rounded-lg border border-white/5">
                        <p className="text-sm text-text-secondary">File Size</p>
                        <p className="font-semibold">
                          {(analysisResult.technicalDetails.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="bg-surface-light/50 p-3 rounded-lg border border-white/5">
                        <p className="text-sm text-text-secondary">Model Type</p>
                        <p className="font-semibold">{analysisResult.technicalDetails.modelType}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => setShowChat(true)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transition-all flex-1 min-w-[200px]"
              >
                Discuss with AI Assistant
              </button>

              <button
                onClick={() => router.push('/doctor/dashboard/upload')}
                className="px-6 py-3 rounded-lg border border-border/30 text-text-secondary hover:bg-surface-light transition-all flex-1 min-w-[200px]"
              >
                Analyze Another Scan
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Embedded Chat Overlay */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-background shadow-2xl z-50 p-4 border-l border-border"
          >
            <div className="h-full flex flex-col relative">
              <button
                onClick={() => setShowChat(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <DiagnosticAssistantChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}