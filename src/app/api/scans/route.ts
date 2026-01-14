
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'scans.json');

// Helper to read scans
function getScans() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Helper to write scans
function saveScans(scans: any[]) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(scans, null, 2));
}

export async function GET() {
    const scans = getScans();
    return NextResponse.json(scans);
}

export async function POST(request: Request) {
    try {
        const newScan = await request.json();

        // Add timestamp and ID if missing
        const scanEntry = {
            id: newScan.id || `SC-${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...newScan
        };

        const scans = getScans();
        scans.unshift(scanEntry); // Add to beginning
        saveScans(scans);

        return NextResponse.json({ success: true, scan: scanEntry });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save scan' }, { status: 500 });
    }
}
