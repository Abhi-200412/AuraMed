import { analyzeMedicalImage, isSupportedMedicalImage } from './medicalImagingAnalysis';

export interface AnomalyResult {
  anomalyDetected: boolean;
  confidenceScore: number;
  findings: string;
  severity: 'low' | 'medium' | 'high' | 'none';
  recommendations: string[];
  heatmapAreas?: string[];
}

/**
 * Analyze medical image for anomalies using AI
 * 
 * This function ensures the detection AI is always used for analysis
 * and does not fall back to mock analysis when the AI fails
 */
export async function analyzeImageForAnomalies(
  imageData: Buffer | ArrayBuffer,
  imageType: string = 'image/jpeg',
  fileName: string = 'unknown'
): Promise<AnomalyResult> {
  // Check if this is a medical imaging file that requires specialized analysis
  if (isSupportedMedicalImage(imageType, fileName)) {
    console.log('[INFO] Medical imaging file detected, using specialized medical imaging analysis');

    try {
      // Convert to ArrayBuffer if it's a Buffer
      const buffer = imageData instanceof Buffer
        ? imageData.buffer.slice(imageData.byteOffset, imageData.byteOffset + imageData.byteLength)
        : imageData;

      const medicalResult = await analyzeMedicalImage(buffer, fileName, imageType);

      // Log severity for monitoring
      if (medicalResult.severity !== 'none') {
        console.log(`[INFO] ${medicalResult.severity.toUpperCase()} severity anomaly detected - ${medicalResult.findings.substring(0, 50)}...`);
      }

      return {
        anomalyDetected: medicalResult.anomalyDetected,
        confidenceScore: medicalResult.confidenceScore,
        findings: medicalResult.findings,
        severity: medicalResult.severity,
        recommendations: medicalResult.recommendations,
        heatmapAreas: medicalResult.heatmapAreas,
      };
    } catch (error) {
      console.error('Error processing medical imaging file:', error);
      // Re-throw the error to be handled by the calling function
      // Do not fall back to mock analysis
      throw error;
    }
  }

  // For regular images, use the detection AI with patient role
  try {
    // Convert to ArrayBuffer if it's a Buffer
    const buffer = imageData instanceof Buffer
      ? imageData.buffer.slice(imageData.byteOffset, imageData.byteOffset + imageData.byteLength)
      : imageData;

    // Import the detection AI service
    const { detectAnomalies } = await import('./detectionAI');

    // Analyze as patient image
    const patientResult = await detectAnomalies(buffer, fileName, imageType, 'patient');

    return {
      anomalyDetected: patientResult.anomalyDetected,
      confidenceScore: patientResult.confidenceScore,
      findings: patientResult.findings,
      severity: patientResult.severity,
      recommendations: patientResult.recommendations,
      heatmapAreas: patientResult.heatmapAreas,
    };
  } catch (error) {
    console.error('Error analyzing patient image:', error);
    // Re-throw the error to be handled by the calling function
    // Do not fall back to mock analysis
    throw error;
  }
}