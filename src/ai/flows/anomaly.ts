
import { z } from 'zod';
import { analyzeImageForAnomalies } from '../anomalyDetection';

// Define the input schema for the anomaly detection flow
export const AnomalyInputSchema = z.object({
  imageBase64: z.string(),
  imageType: z.string().optional(),
});

// Define the output schema for the anomaly detection flow
export const AnomalyOutputSchema = z.object({
  anomalyDetected: z.boolean(),
  confidenceScore: z.number(),
  findings: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'none']),
  recommendations: z.array(z.string()),
  heatmapAreas: z.array(z.string()).optional(),
});

/**
 * Defines the anomaly detection flow
 */
export const anomalyFlow = async (
  input: z.infer<typeof AnomalyInputSchema>
): Promise<z.infer<typeof AnomalyOutputSchema>> => {
  const { imageBase64, imageType } = input;

  // Call the existing function to analyze the image
  const result = await analyzeImageForAnomalies(imageBase64, imageType);

  return result;
};
