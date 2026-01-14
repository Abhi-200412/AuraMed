/**
 * Medical Imaging Analysis Service
 * Handles communication with the detection AI service for medical image analysis
 */

import { detectAnomalies } from './detectionAI';

/**
 * Validate if the file is a supported medical imaging format
 */
export function isSupportedMedicalImage(fileType: string, fileName: string): boolean {
  const supportedTypes = [
    'application/x-gzip',
    'application/gzip',
    'application/x-nii',
    'application/nii',
    'application/octet-stream'
  ];
  
  const supportedExtensions = ['.nii.gz', '.nii', '.gz'];
  const lowerFileName = fileName.toLowerCase();
  
  // Check MIME type
  if (supportedTypes.includes(fileType)) {
    return true;
  }
  
  // Check file extension
  return supportedExtensions.some(ext => lowerFileName.endsWith(ext));
}

/**
 * Analyze medical image using the detection AI service
 */
export async function analyzeMedicalImage(
  fileData: ArrayBuffer,
  fileName: string,
  fileType: string
): Promise<any> {
  try {
    console.log(`[DEBUG] Analyzing medical image with detection AI: ${fileName} (${fileType})`);
    
    // For medical imaging files, we assume this is for a doctor
    const result = await detectAnomalies(fileData, fileName, fileType, 'doctor');
    
    return result;
  } catch (error) {
    console.error('Medical image analysis error:', error);
    throw error;
  }
}