'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertTriangle, Loader2, ArrowRight, User, Activity, Brain, Scan } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

interface AnalysisResult {
  anomalyDetected: boolean;
  confidenceScore: number;
  findings: string;
  severity: 'low' | 'medium' | 'high' | 'none';
  recommendations: string[];
  heatmapAreas?: string[];
  heatmapImage?: string; // Base64 encoded heatmap overlay
  visionReport?: string; // New: AI Vision Description
}

interface DoctorInfo {
  name: string;
  specialty: string;
  email: string;
  id: string;
}

export function PatientUploadPortal() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [assignedDoctor, setAssignedDoctor] = useState<DoctorInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');

  // Progress States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('Initializing...');

  useEffect(() => {
    // Load patient information from localStorage
    const storedPatientInfo = localStorage.getItem('patientInfo');
    if (storedPatientInfo) {
      setPatientInfo(JSON.parse(storedPatientInfo));
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      setError('File size must be less than 500MB');
      return;
    }

    setUploadedFile(file);
    setAnalysisResult(null); // Clear previous analysis results
    setAssignedDoctor(null);
    setError('');
    setUploadProgress(0);
    setAnalysisProgress(0);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const pollAnalysisStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        console.log(`Polling status for job: ${jobId}`);
        const response = await axios.get(`/api/analyze/status?jobId=${jobId}`);
        const data = response.data;
        console.log('Poll Response:', data.status, data.progress);

        setAnalysisProgress(data.progress || 0);
        setAnalysisStep(data.message || 'Processing...');

        // Check for completion (Case-insensitive)
        if (data.status && data.status.toLowerCase() === 'completed') {
          console.log('Analysis Completed! Stopping poll.');
          clearInterval(interval);

          // Check for analysis result data (Key: result)
          if (data.result) {
            setAnalysisResult(data.result);
            setAssignedDoctor(data.assignedDoctor || null);

            // Storage
            localStorage.setItem('latestAnalysisResult', JSON.stringify(data.result));
            if (data.assignedDoctor) localStorage.setItem('assignedDoctor', JSON.stringify(data.assignedDoctor));
          } else {
            console.error('Completed status received but analysis data missing!');
            setError('Analysis completed but returned no data.');
          }

          setIsAnalyzing(false);

        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError(data.message || 'Analysis failed');
          setIsAnalyzing(false);
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Continue polling on transient errors
      }
    }, 1000);
    return interval;
  };

  const handleAnalyze = async () => {
    if (!uploadedFile || !imagePreview || !patientInfo) return;

    setIsAnalyzing(true);
    setUploadProgress(0);
    setAnalysisProgress(0);
    setError('');
    setAnalysisStep('Initiating Upload...');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('imageType', uploadedFile.type);
      formData.append('sharedWith', selectedDoctorId);

      // Add patient info as JSON string
      formData.append('patientInfo', JSON.stringify({
        name: patientInfo.name,
        age: patientInfo.age,
        contact: patientInfo.contact,
        email: patientInfo.email,
        address: patientInfo.address,
        fileName: uploadedFile.name,
        uploadDate: new Date().toISOString(),
      }));

      // Call analyze API to start job
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
          if (percentCompleted === 100) {
            setAnalysisStep('Processing on Server...');
          }
        }
      });

      const { jobId } = response.data;

      // Start polling for status
      pollAnalysisStatus(jobId);

    } catch (err: any) {
      console.error('Analysis initiation error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to start analysis. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const handleProceedToChat = () => {
    // Redirect to AI chat with context
    router.push('/patient/dashboard/chat');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-8 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-2">
        <Scan className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold text-gradient">AI Diagnostic Center</h2>
      </div>
      <p className="text-text-secondary mb-8 ml-11">Upload your medical scans for instant, AI-powered analysis.</p>

      {/* Doctor Selection */}
      {!analysisResult && !isAnalyzing && (
        <div className="mb-6 ml-1">
          <label className="block text-sm font-medium text-text-secondary mb-2">Share results with:</label>
          <select
            className="w-full p-3 rounded-lg bg-surface-light/50 border border-white/10 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            defaultValue="all"
          >
            <option value="all">All Doctors (Recommended)</option>
            <option value="DOC-001">Dr. Sarah Johnson (Radiology)</option>
            <option value="DOC-002">Dr. Michael Chen (Oncology)</option>
            <option value="DOC-003">Dr. Emily Rodriguez (General)</option>
          </select>
        </div>
      )}

      {/* Upload Area */}
      {!analysisResult && !isAnalyzing && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${isDragging
            ? 'border-primary bg-primary/10 scale-[1.02] shadow-xl'
            : 'border-primary/30 hover:border-primary/50 hover:bg-surface-light/30'
            }`}
        >
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-500 ${isDragging ? 'rotate-12 scale-110' : ''}`}>
            <Upload className="w-10 h-10 text-primary" />
          </div>

          <p className="text-xl font-semibold mb-2">Drag and drop your medical image</p>
          <p className="text-text-secondary mb-2">Supports JPG, PNG formats (max 500MB)</p>
          <p className="text-sm text-text-tertiary mb-8">Secure, HIPAA-compliant upload</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="patient-file-upload"
          />

          <button
            onClick={() => document.getElementById('patient-file-upload')?.click()}
            className="px-8 py-3 rounded-lg bg-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all btn-hover font-semibold"
          >
            Select Image
          </button>
        </div>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg flex items-center gap-2 overflow-hidden"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis In Progress View */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 px-6 text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Pulse Effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary/50 border-t-transparent animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-surface-light flex items-center justify-center z-10">
              <Brain className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2">{analysisStep}</h3>
          <p className="text-text-secondary mb-8">Please wait while our AI analyzes your scan...</p>

          {/* Progress Bars Container */}
          <div className="max-w-md mx-auto space-y-6">
            {/* Upload Progress */}
            <div>
              <div className="flex justify-between text-xs mb-2 text-text-secondary uppercase tracking-wider font-semibold">
                <span>Upload Status</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            {/* Analysis Progress */}
            <div>
              <div className="flex justify-between text-xs mb-2 text-text-secondary uppercase tracking-wider font-semibold">
                <span>Analysis Status</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Image Preview (Before Analysis) */}
      {uploadedFile && imagePreview && !analysisResult && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <div className="p-6 rounded-xl bg-surface-light/50 border border-primary/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-text-secondary">Selected file</p>
                <p className="font-semibold text-primary text-lg">{uploadedFile.name}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">
                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            {/* Image Preview */}
            <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-black/40 border border-white/5">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>

            <button
              onClick={handleAnalyze}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all btn-hover flex items-center justify-center gap-3"
            >
              <Activity className="w-5 h-5" />
              Start AI Analysis
            </button>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6 space-y-6"
          >
            {/* Image Display with Heatmap Overlay */}
            {imagePreview && (
              <div className="relative w-full h-80 rounded-xl overflow-hidden bg-black/40 border-2 border-primary/30 shadow-2xl group">
                <Image
                  src={imagePreview}
                  alt="Analyzed scan"
                  fill
                  className="object-contain"
                />

                {/* Heatmap Overlay */}
                {analysisResult.heatmapImage && (
                  <div className="absolute inset-0 z-10 opacity-60 mix-blend-screen transition-opacity duration-500">
                    <img
                      src={`data:image/png;base64,${analysisResult.heatmapImage}`}
                      alt="AI Heatmap"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white text-sm font-semibold flex items-center gap-2 z-20">
                  <Brain className="w-4 h-4 text-primary" />
                  AI Analysis Layer
                </div>

                {/* Legend */}
                {analysisResult.anomalyDetected && (
                  <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white text-xs z-20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-red-500 blur-[2px]"></div>
                      <span>High Anomaly Probability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 blur-[2px]"></div>
                      <span>Normal Tissue</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results Card */}
            <div className="glass p-8 rounded-xl border-2 border-primary/30 relative overflow-hidden">
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-${analysisResult.anomalyDetected ? 'red' : 'green'}-500/10 blur-3xl rounded-full -z-10`}></div>

              <div className="flex items-center gap-4 mb-6">
                {analysisResult.anomalyDetected ? (
                  analysisResult.severity === 'high' ? (
                    <div className="p-3 rounded-full bg-red-500/20 border border-red-500/50">
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                  ) : analysisResult.severity === 'medium' ? (
                    <div className="p-3 rounded-full bg-yellow-500/20 border border-yellow-500/50">
                      <AlertTriangle className="w-8 h-8 text-yellow-400" />
                    </div>
                  ) : (
                    <div className="p-3 rounded-full bg-green-500/20 border border-green-500/50">
                      <AlertTriangle className="w-8 h-8 text-green-400" />
                    </div>
                  )
                ) : (
                  <div className="p-3 rounded-full bg-green-500/20 border border-green-500/50">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold">
                    {analysisResult.anomalyDetected ? 'Anomaly Detected' : 'No Anomalies Detected'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 w-24 bg-black/20 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${analysisResult.confidenceScore > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${analysisResult.confidenceScore}%` }}></div>
                    </div>
                    <p className="text-sm text-text-secondary font-mono">{analysisResult.confidenceScore}% Confidence</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Severity Badge */}
                {analysisResult.anomalyDetected && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${analysisResult.severity === 'high'
                    ? 'bg-red-500/20 border border-red-500/50'
                    : analysisResult.severity === 'medium'
                      ? 'bg-yellow-500/20 border border-yellow-500/50'
                      : 'bg-green-500/20 border border-green-500/50'
                    }`}>
                    <span className={`text-sm font-semibold ${analysisResult.severity === 'high'
                      ? 'text-red-300'
                      : analysisResult.severity === 'medium'
                        ? 'text-yellow-300'
                        : 'text-green-300'
                      }`}>
                      Severity: {analysisResult.severity.toUpperCase()}
                      {analysisResult.severity === 'high' && ' - Urgent Attention Required'}
                      {analysisResult.severity === 'medium' && ' - Clinical Monitoring Advised'}
                      {analysisResult.severity === 'low' && ' - Routine Follow-up'}
                    </span>
                  </div>
                )}

                {/* Findings */}
                <div className="bg-surface-light/30 p-5 rounded-lg border border-white/5">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Scan className="w-5 h-5 text-primary" />
                    Clinical Findings
                  </h4>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">{analysisResult.findings}</p>
                </div>

                {/* AI Vision Report (Llava) */}
                {analysisResult.visionReport && (
                  <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-5 rounded-lg border border-purple-500/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full -z-10 group-hover:bg-purple-500/20 transition-all"></div>

                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-purple-200">
                      <Brain className="w-5 h-5 text-purple-400" />
                      AI Radiologist's Analysis
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Llava 3 Vision</span>
                    </h4>

                    <p className="text-purple-100/90 leading-relaxed italic border-l-2 border-purple-500/50 pl-4 py-1">
                      "{analysisResult.visionReport}"
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3">AI Recommendations</h4>
                    <ul className="space-y-3">
                      {analysisResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-text-secondary bg-surface-light/20 p-3 rounded-lg">
                          <span className="text-primary mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Heatmap Areas */}
                {analysisResult.heatmapAreas && analysisResult.heatmapAreas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Areas of Interest</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.heatmapAreas.map((area, idx) => (
                        <span key={idx} className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Notification - Only for HIGH severity */}
            {assignedDoctor && analysisResult.severity === 'high' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-xl border-2 border-red-500/50 bg-red-500/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-6 h-6 text-red-400" />
                  <h4 className="font-bold text-lg text-red-300">🚨 Urgent - Doctor Notified</h4>
                </div>
                <p className="text-text-secondary mb-4">
                  Due to the <span className="font-semibold text-red-300">high severity</span> of the findings, your scan results have been immediately sent to your assigned physician for urgent review.
                </p>
                <div className="p-4 rounded-lg bg-surface-light/50 border border-red-500/30">
                  <p className="font-semibold text-red-300">{assignedDoctor.name}</p>
                  <p className="text-sm text-text-tertiary">{assignedDoctor.specialty}</p>
                  <p className="text-sm text-text-tertiary mt-1">{assignedDoctor.email}</p>
                </div>
                <p className="text-sm text-yellow-300 mt-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Please expect a call from your doctor within 24 hours</span>
                </p>
              </motion.div>
            )}

            {/* Proceed to Chat Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleProceedToChat}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-text-primary font-bold text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 group"
            >
              <span>Discuss Results with AI Assistant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Reset Button */}
            <button
              onClick={() => {
                setUploadedFile(null);
                setImagePreview(null);
                setAnalysisResult(null);
                setAssignedDoctor(null);
              }}
              className="w-full px-4 py-3 rounded-lg border border-border/30 text-text-secondary hover:bg-surface-light transition-all"
            >
              Upload Another Scan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}