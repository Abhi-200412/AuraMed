import { NextResponse } from 'next/server';
import { conversationalFlow, ConversationalInputSchema } from '@/ai/flows/conversational';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input using Zod schema
    const validationResult = ConversationalInputSchema.safeParse({
      userMessage: body.message,
      conversationHistory: body.history,
      patientContext: body.context,
    });

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validationResult.error.issues }, { status: 400 });
    }

    const aiResponse = await conversationalFlow(validationResult.data);

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Chat service failed: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
  }
}