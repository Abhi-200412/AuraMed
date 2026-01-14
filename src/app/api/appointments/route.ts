import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Store appointments in a local JSON file for persistence across server restarts (mock DB)
const DB_PATH = path.join(process.cwd(), 'src', 'data', 'appointments.json');

// Ensure directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initial seed if empty
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([
        {
            id: 'apt_1',
            patientName: 'John Doe',
            doctorId: 'DOC-001',
            date: '2024-02-15',
            time: '10:00 AM',
            status: 'pending', // pending, confirmed, rescheduled, completed
            reason: 'Follow-up on Liver Scan Analysis'
        }
    ], null, 2));
}

export async function GET(req: Request) {
    try {
        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        const appointments = JSON.parse(fileData);
        return NextResponse.json({ appointments });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { patientName, doctorId, date, time, reason } = body;

        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        const appointments = JSON.parse(fileData);

        const newAppointment = {
            id: `apt_${Date.now()}`,
            patientName: patientName || 'Anonymous',
            doctorId: doctorId || 'DOC-001',
            date,
            time,
            status: 'pending',
            reason
        };

        appointments.push(newAppointment);
        fs.writeFileSync(DB_PATH, JSON.stringify(appointments, null, 2));

        return NextResponse.json({ message: 'Appointment requested successfully', appointment: newAppointment });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, status, newDate, newTime } = body;

        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        let appointments = JSON.parse(fileData);

        const index = appointments.findIndex((a: any) => a.id === id);
        if (index === -1) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });

        if (status) appointments[index].status = status;
        if (newDate) appointments[index].date = newDate;
        if (newTime) appointments[index].time = newTime;

        fs.writeFileSync(DB_PATH, JSON.stringify(appointments, null, 2));

        return NextResponse.json({ message: 'Appointment updated', appointment: appointments[index] });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
}
