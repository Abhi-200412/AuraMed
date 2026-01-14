
import { NextResponse } from 'next/server';
import { predictiveFlow, PredictiveInputSchema } from '@/ai/flows/predictive';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input using Zod schema
    const validationResult = PredictiveInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validationResult.error.issues }, { status: 400 });
    }

    const prediction = await predictiveFlow(validationResult.data);

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Error in predict API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
