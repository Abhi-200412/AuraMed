import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
        return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    try {
        // Poll Python Service
        const response = await axios.get(`http://localhost:8000/status/${jobId}`);
        const jobData = response.data;

        if (jobData.status === 'completed') {
            const analysisResult = jobData.result;
            const patientInfoString = jobData.patientInfo;

            let patientInfo: any = {};
            try {
                if (patientInfoString) {
                    patientInfo = JSON.parse(patientInfoString);
                }
            } catch (e) {
                console.error('Error parsing patient info from job:', e);
            }

            // --- Post-Processing Logic (Moved from original analyze route) ---

            // Only notify doctors for HIGH severity anomalies
            const shouldNotifyDoctor = analysisResult.anomalyDetected && analysisResult.severity === 'high';

            // Notify patient for any detected anomalies
            const shouldNotifyPatient = analysisResult.anomalyDetected;

            // Forward to Doctor's Portal if ANY anomaly is detected
            if (analysisResult.anomalyDetected) {
                console.log('[INFO] Anomaly detected - forwarding to Doctor Portal');

                const patientData = {
                    id: jobId, // Use jobId as unique ID to prevent duplicates if we wanted to enforce uniqueness
                    name: patientInfo?.name || 'Anonymous Patient',
                    age: patientInfo?.age || 'N/A',
                    contact: patientInfo?.contact || 'N/A',
                    email: patientInfo?.email || 'N/A',
                    address: patientInfo?.address || 'N/A',
                    scanType: 'CT Liver Scan',
                    date: new Date().toLocaleDateString(),
                    status: 'Anomaly Detected',
                    severity: analysisResult.severity,
                    confidence: analysisResult.confidenceScore,
                    findings: analysisResult.findings,
                    timestamp: new Date().toISOString(),
                    analysisResult // Full details
                };

                // Persist to data/scans.json
                try {
                    const dataDir = path.join(process.cwd(), 'data');
                    const dataFile = path.join(dataDir, 'scans.json');

                    if (!fs.existsSync(dataDir)) {
                        fs.mkdirSync(dataDir);
                    }

                    let scans = [];
                    if (fs.existsSync(dataFile)) {
                        const fileContent = fs.readFileSync(dataFile, 'utf-8');
                        try {
                            scans = JSON.parse(fileContent);
                        } catch (e) {
                            console.error('Error parsing scans.json', e);
                        }
                    }

                    // Check if this scan (jobId) is already saved to avoid duplicates on re-polling
                    const exists = scans.some((scan: any) => scan.id === jobId);
                    if (!exists) {
                        scans.unshift(patientData); // Add to top
                        fs.writeFileSync(dataFile, JSON.stringify(scans, null, 2));
                        console.log('Saved anomaly to data/scans.json');
                    }

                } catch (error) {
                    console.error('Failed to save scan to file:', error);
                }
            }

            // Prepare notification for patient
            let patientNotification = null;
            if (shouldNotifyPatient) {
                patientNotification = {
                    id: Date.now(),
                    type: 'anomaly_detected',
                    title: analysisResult.severity === 'high' ? 'Important: Anomaly Detected in Your Scan' : 'Scan Results Available',
                    message: analysisResult.severity === 'high'
                        ? 'A significant finding was detected in your recent scan. Your doctor has been notified and will contact you soon.'
                        : 'Your scan results are ready. No urgent concerns, but review with your doctor when possible.',
                    severity: analysisResult.severity,
                    timestamp: new Date().toISOString(),
                    read: false,
                    actionUrl: '/patient/dashboard/chat'
                };
            }

            const response = NextResponse.json({
                status: 'completed',
                progress: 100,
                message: 'Analysis Complete',
                result: analysisResult, // Standardized key (was 'analysis')
                doctorNotified: shouldNotifyDoctor,
                patientNotified: shouldNotifyPatient,
                patientNotification,
                assignedDoctor: shouldNotifyDoctor
                    ? {
                        name: 'Dr. Sarah Johnson',
                        specialty: 'Radiology',
                        email: 'dr.johnson@auramed.com',
                        id: 'DOC-001'
                    }
                    : null,
            });

            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            response.headers.set('Pragma', 'no-cache');
            response.headers.set('Expires', '0');
            return response;

        } else {
            // Return in-progress status
            return NextResponse.json({
                status: jobData.status,
                progress: jobData.progress,
                message: jobData.message
            }, {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
        }

    } catch (error: any) {
        console.error('Error polling status:', error);
        return NextResponse.json(
            { error: 'Status check failed: ' + (error.message || 'Unknown error') },
            { status: 500 }
        );
    }
}
