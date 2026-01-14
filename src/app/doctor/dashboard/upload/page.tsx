'use client';

import { useState } from 'react';
import { Upload, FileUp, AlertTriangle, CheckCircle, Activity, Brain, Scan, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';




import { useRouter } from 'next/navigation';

export default function DoctorUploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Patient Info State
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState(`PT-${Math.floor(Math.random() * 10000)}`);

  // Progress States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('Initializing...');

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
    // Validate file type for medical imaging
    const validTypes = [
      'application/x-gzip',
      'application/gzip',
      'application/x-nii',
      'application/nii',
      'application/octet-stream',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    const validExtensions = ['.nii.gz', '.nii', '.gz', '.png', '.jpg', '.jpeg'];
    const fileName = file.name.toLowerCase();

    const isValidType = validTypes.includes(file.type) ||
      validExtensions.some(ext => fileName.endsWith(ext));

    // Note: We allow all types for now to support testing, but in prod we'd enforce this
    // if (!isValidType) { ... }

    setAnalysisResult(null);
    setUploadedFile(file);
    setError('');
    setUploadProgress(0);
    setAnalysisProgress(0);
  };

  const pollAnalysisStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/analyze/status?jobId=${jobId}`);
        const data = response.data;

        setAnalysisProgress(data.progress);
        setAnalysisStep(data.message);

        if (data.status === 'completed') {
          clearInterval(interval);

          // Bug Fix: Backend returns 'result', not 'analysis'
          const finalResult = data.result;

          if (finalResult) {
            setAnalysisResult(finalResult);
            // Store in localStorage for analyze page retrieval
            localStorage.setItem('latestDoctorAnalysis', JSON.stringify(finalResult));
          }

          setIsAnalyzing(false);
          // Optional: Delay redirect to show success state or just stay here
          // router.push('/doctor/dashboard/analyze'); 
          // We stay on this page because it has a full result view capable of display
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError(data.message || 'Analysis failed');
          setIsAnalyzing(false);
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Continue polling on transient errors
      }
    }, 1000); // Poll every 1 second
    return interval;
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setUploadProgress(0);
    setAnalysisProgress(0);
    setError('');
    setAnalysisStep('Initiating Upload...');

    // Construct Patient Profile
    const patientProfile = {
      name: patientName || 'Anonymous Patient',
      id: patientId,
      age: 45, // Default for now
      gender: 'Unknown',
      referringPhysician: 'Dr. Sarah Johnson',
      scanDate: new Date().toLocaleDateString(),
      fileName: uploadedFile.name
    };

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('imageType', uploadedFile.type);
      formData.append('patientInfo', JSON.stringify(patientProfile));

      // Save to localStorage for Chat/PDF use
      localStorage.setItem('currentPatientProfile', JSON.stringify(patientProfile));

      // Call analyze API with axios for progress tracking
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
      console.error('Analysis error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to analyze image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gradient">Medical Image Analysis</h1>
            <p className="text-text-secondary mt-1">
              AI-powered diagnostic analysis for CT, MRI, and X-Ray data
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8 max-w-4xl mx-auto"
        >
          {/* Patient Info Input */}
          {!isAnalyzing && !analysisResult && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">Patient Name (Optional)</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name for report..."
                className="w-full px-4 py-3 rounded-lg bg-surface-light border border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          )}

          {/* Upload Area */}
          {!uploadedFile && !analysisResult && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-16 text-center transition-all duration-300 ${isDragging
                ? 'border-primary bg-primary/10 scale-[1.02] shadow-xl'
                : 'border-primary/30 hover:border-primary/50 hover:bg-surface-light/30'
                }`}
            >
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-500 ${isDragging ? 'rotate-12 scale-110' : ''}`}>
                <FileUp className="w-12 h-12 text-primary" />
              </div>

              <p className="text-2xl font-semibold mb-3">Upload Medical Imaging File</p>
              <p className="text-text-secondary mb-2">Supports CT/MRI (.nii.gz) and X-Ray (.png, .jpg)</p>
              <p className="text-sm text-text-tertiary mb-8">Compatible with volumetric and 2D data sources</p>

              <input
                type="file"
                accept=".nii.gz,.nii,.gz,application/x-gzip,application/gzip,application/octet-stream,image/png,image/jpeg,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
                id="doctor-file-upload"
              />

              <button
                onClick={() => document.getElementById('doctor-file-upload')?.click()}
                className="px-10 py-4 rounded-lg bg-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all btn-hover font-semibold text-lg"
              >
                Select File
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
              <p className="text-text-secondary mb-8">Processing volumetric data...</p>

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

          {/* File Info & Analyze (Before Analysis) */}
          {uploadedFile && !analysisResult && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-8 rounded-xl bg-surface-light/50 border border-primary/20 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <Scan className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Selected file</p>
                    <p className="font-semibold text-primary text-xl">{uploadedFile.name}</p>
                    <p className="text-sm text-text-secondary font-mono mt-1">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all btn-hover flex items-center justify-center gap-3 min-w-[240px]"
                >
                  <Activity className="w-5 h-5" />
                  Run Analysis
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
                <div className="glass p-8 rounded-xl border-2 border-primary/30 relative overflow-hidden">
                  {/* Background Glow */}
                  <div className={`absolute top-0 right-0 w-96 h-96 bg-${analysisResult.anomalyDetected ? 'red' : 'green'}-500/5 blur-3xl rounded-full -z-10`}></div>

                  <div className="flex items-center gap-4 mb-8">
                    {analysisResult.anomalyDetected ? (
                      analysisResult.severity === 'high' ? (
                        <div className="p-4 rounded-full bg-red-500/20 border border-red-500/50">
                          <AlertTriangle className="w-10 h-10 text-red-400" />
                        </div>
                      ) : analysisResult.severity === 'medium' ? (
                        <div className="p-4 rounded-full bg-yellow-500/20 border border-yellow-500/50">
                          <AlertTriangle className="w-10 h-10 text-yellow-400" />
                        </div>
                      ) : (
                        <div className="p-4 rounded-full bg-green-500/20 border border-green-500/50">
                          <AlertTriangle className="w-10 h-10 text-green-400" />
                        </div>
                      )
                    ) : (
                      <div className="p-4 rounded-full bg-green-500/20 border border-green-500/50">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-3xl font-bold">
                        {analysisResult.anomalyDetected ? 'Anomaly Detected' : 'No Anomalies Detected'}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="h-2 w-32 bg-black/20 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${analysisResult.confidenceScore > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${analysisResult.confidenceScore}%` }}></div>
                        </div>
                        <p className="text-text-secondary font-mono text-lg">{analysisResult.confidenceScore}% Confidence</p>
                      </div>

                      {/* Model Source Badge */}
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                        <Brain className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-medium text-blue-300 uppercase tracking-wide">
                          Model: {analysisResult.technicalDetails?.modelType || 'Standard Analysis'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visualization Section */}


                  <div className="space-y-6">
                    {/* Severity Badge */}
                    {analysisResult.anomalyDetected && (
                      <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${analysisResult.severity === 'high'
                        ? 'bg-red-500/20 border border-red-500/50'
                        : analysisResult.severity === 'medium'
                          ? 'bg-yellow-500/20 border border-yellow-500/50'
                          : 'bg-green-500/20 border border-green-500/50'
                        }`}>
                        <span className={`font-bold ${analysisResult.severity === 'high'
                          ? 'text-red-300'
                          : analysisResult.severity === 'medium'
                            ? 'text-yellow-300'
                            : 'text-green-300'
                          }`}>
                          SEVERITY: {analysisResult.severity.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Findings */}
                    <div className="bg-surface-light/30 p-5 rounded-lg border border-white/5">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Scan className="w-5 h-5 text-primary" />
                        Clinical Findings
                      </h4>
                      <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                        {analysisResult.findings}
                      </p>
                    </div>

                    {/* Neuro-Anatomical Mapping (Atlas) */}
                    {analysisResult.anatomicalRegion && (
                      <div className="bg-blue-900/10 p-5 rounded-lg border border-blue-500/20">
                        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-blue-300">
                          <Activity className="w-5 h-5" />
                          Neuro-Anatomical Localization
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-white tracking-tight">
                            {analysisResult.anatomicalRegion}
                          </div>
                          <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono uppercase">
                            MNI152 Space
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mt-2">
                          Mapped using affine registration to Harvard-Oxford Cortical/Subcortical Atlas.
                        </p>
                      </div>
                    )}

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
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Recommendations</h4>
                      <ul className="space-y-3">
                        {analysisResult.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-text-secondary bg-surface-light/20 p-3 rounded-lg">
                            <span className="text-primary mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    onClick={() => router.push('/doctor/dashboard/chat')}
                    className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all btn-hover flex items-center justify-center gap-3 min-w-[240px]"
                  >
                    <Brain className="w-5 h-5" />
                    Discuss with AI Assistant
                  </button>

                  <button
                    onClick={() => {
                      setAnalysisResult(null);
                      setUploadedFile(null);
                      setUploadProgress(0);
                      setAnalysisProgress(0);
                    }}
                    className="flex-1 px-6 py-4 rounded-xl bg-surface-light border border-white/10 hover:bg-white/5 text-text-primary font-semibold text-lg transition-all flex items-center justify-center gap-3 min-w-[240px]"
                  >
                    <Upload className="w-5 h-5" />
                    Analyze Another Scan
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}