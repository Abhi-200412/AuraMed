
import { z } from 'zod';
import { predictDiseaseProgression } from '../predictiveAnalytics';

// Define the input schema for the predictive flow
export const PredictiveInputSchema = z.object({
  patientId: z.string(),
});

// Define the output schema for the predictive flow
export const PredictiveOutputSchema = z.object({
  patientId: z.string(),
  riskScore: z.number(),
  predictedOutcome: z.string(),
  recommendations: z.array(z.string()),
});

/**
 * Defines the predictive analytics flow
 */
export const predictiveFlow = async (
  input: z.infer<typeof PredictiveInputSchema>
): Promise<z.infer<typeof PredictiveOutputSchema>> => {
  const { patientId } = input;

  // Call the existing function to predict disease progression
  const prediction = await predictDiseaseProgression(patientId);

  return prediction;
};
