
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const patientInfoString = formData.get('patientInfo') as string;

    if (!file) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    // Convert file to Buffer for axios
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create FormData for the Python service
    const pythonFormData = new FormData();
    pythonFormData.append('file', new Blob([buffer], { type: file.type }), file.name);

    if (patientInfoString) {
      pythonFormData.append('patientInfo', patientInfoString);
    }

    // Call Python Service to start job
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
      const response = await axios.post(`${apiUrl}/analyze`, pythonFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { jobId } = response.data;

      // Return jobId and patient info (to be used in status polling for saving context)
      return NextResponse.json({
        success: true,
        jobId,
        patientInfo: patientInfoString ? JSON.parse(patientInfoString) : null
      });

    } catch (axiosError: any) {
      // Check for connection refusal (backend not running or starting up)
      if (axiosError.code === 'ECONNREFUSED' || (axiosError.cause && axiosError.cause.code === 'ECONNREFUSED')) {
        console.warn('Backend service unavailable:', axiosError.message);
        return NextResponse.json(
          { error: 'The AI Analysis service is currently starting up or unavailable. Please try again in a moment.' },
          { status: 503 }
        );
      }
      throw axiosError; // Re-throw to be caught by the outer catch block
    }

  } catch (error: any) {
    console.error('Error in analyze API:', error);

    // Fallback for other errors
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Analysis initiation failed';

    return NextResponse.json({ error: message }, { status });
  }
}