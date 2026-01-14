/**
 * Detection AI Service
 * Implements enhanced file analysis using dedicated MONAI Service
 * Replaces Gemini for detection tasks while maintaining interface compatibility
 */

/**
 * Enhanced result interface for better type safety
 */
interface DetectionResult {
  anomalyDetected: boolean;
  confidenceScore: number;
  findings: string;
  severity: 'none' | 'low' | 'medium' | 'high';
  recommendations: string[];
  heatmapAreas: string[];
  detailedAnalysis?: {
    primaryCondition: string;
    differentialDiagnoses: { condition: string; probability: number }[];
    affectedOrganSystem: string;
    urgencyLevel: 'routine' | 'urgent' | 'critical';
  };
  technicalDetails: {
    modelType: string;
    processingTime: number;
    fileSize: number;
    analysisMethod: string;
  };
}

/**
 * Analyze medical image for doctors (direct .nii.gz processing)
 */
export async function detectAnomalies(
  fileData: ArrayBuffer,
  fileName: string,
  fileType: string,
  userRole: 'doctor' | 'patient' = 'doctor'
): Promise<DetectionResult> {
  // Use enhanced approach for both doctors and patients
  return await analyzeImageEnhanced(fileData, fileName, fileType, userRole);
}

/**
 * Enhanced image analysis using dedicated MONAI Service
 */
async function analyzeImageEnhanced(
  fileData: ArrayBuffer,
  fileName: string,
  fileType: string,
  userRole: 'doctor' | 'patient'
): Promise<DetectionResult> {
  const startTime = Date.now();

  try {
    // Create FormData to send to Python service
    const formData = new FormData();
    const blob = new Blob([fileData], { type: fileType });
    formData.append('file', blob, fileName);

    // Call local MONAI service
    // Note: In production, this URL should be configurable via env vars
    const serviceUrl = process.env.NEXT_PUBLIC_MONAI_SERVICE_URL || 'http://localhost:8000';

    const response = await fetch(`${serviceUrl}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`MONAI Service error: ${response.status} - ${await response.text()}`);
    }

    const result = await response.json();

    // The Python service returns data matching our interface, so we can return it directly
    // but we ensure all fields are present
    return {
      anomalyDetected: result.anomalyDetected,
      confidenceScore: result.confidenceScore,
      findings: result.findings,
      severity: result.severity,
      recommendations: result.recommendations,
      heatmapAreas: result.heatmapAreas,
      detailedAnalysis: result.detailedAnalysis,
      technicalDetails: {
        ...result.technicalDetails,
        processingTime: Date.now() - startTime
      }
    };

  } catch (error) {
    console.error("MONAI Analysis Failed:", error);
    const processingTime = Date.now() - startTime;

    // Fallback if service is offline
    return {
      anomalyDetected: false,
      confidenceScore: 0,
      findings: 'Error connecting to AI Analysis Service. Please ensure the backend is running.',
      severity: 'none',
      recommendations: ['Check system status', 'Try again later'],
      heatmapAreas: [],
      technicalDetails: {
        modelType: 'connection-error',
        processingTime,
        fileSize: fileData.byteLength,
        analysisMethod: 'failed'
      }
    };
  }
}