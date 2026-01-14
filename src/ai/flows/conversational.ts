
import { z } from 'zod';
import { generatePatientResponse, ConversationMessage } from '../conversational';

// Define the input schema for the conversational flow
export const ConversationalInputSchema = z.object({
  userMessage: z.string(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
      timestamp: z.number().optional(),
    })
  ),
  patientContext: z.object({
    condition: z.string().optional(),
    lastAnalysis: z.string().optional(),
    concernType: z.string().optional(),
    userType: z.string().optional(),
    analysisResult: z.any().optional(),
    hasRecentScan: z.boolean().optional(),
  }).optional(),
});

// Define the output schema for the conversational flow
export const ConversationalOutputSchema = z.object({
  message: z.string(),
  confidence: z.number(),
  suggestedFollowUp: z.string().optional(),
  resources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
    })
  ).optional(),
  needsEscalation: z.boolean(),
});

/**
 * Defines the conversational AI flow
 */
export const conversationalFlow = async (
  input: z.infer<typeof ConversationalInputSchema>
): Promise<z.infer<typeof ConversationalOutputSchema>> => {
  const { userMessage, conversationHistory, patientContext } = input;

  // Call the existing function to generate a patient response
  const response = await generatePatientResponse(
    userMessage,
    conversationHistory as ConversationMessage[],
    patientContext
  );

  return response;
};
