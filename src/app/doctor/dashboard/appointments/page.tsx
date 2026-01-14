'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, MoreVertical, Search, Filter, RefreshCw } from 'lucide-react';

interface Appointment {
    id: string;
    patientName: string;
    doctorId: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled';
    reason: string;
}

export default function AppointmentDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/appointments');
            const data = await res.json();
            setAppointments(data.appointments || []);
        } catch (e) {
            console.error('Failed to fetch appointments', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await fetch('/api/appointments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            fetchAppointments();
        } catch (e) {
            console.error('Update failed', e);
        }
    };

    const filteredAppointments = appointments.filter(apt =>
        filter === 'all' ? true : apt.status === filter
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        Patient Appointments
                    </h1>
                    <p className="text-slate-500">Manage your schedule and consultation requests</p>
                </div>
                <button
                    onClick={fetchAppointments}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Requests', val: appointments.length, color: 'bg-blue-500' },
                    { label: 'Pending', val: appointments.filter(a => a.status === 'pending').length, color: 'bg-yellow-500' },
                    { label: 'Confirmed', val: appointments.filter(a => a.status === 'confirmed').length, color: 'bg-green-500' },
                    { label: 'Rescheduled', val: appointments.filter(a => a.status === 'rescheduled').length, color: 'bg-purple-500' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-800">{stat.val}</p>
                        </div>
                        <div className={`w-2 h-8 rounded-full ${stat.color}`} />
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 pb-2 overflow-x-auto">
                {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Appointment List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading && appointments.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Loading schedule...</div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                        <Calendar className="w-12 h-12 text-slate-200" />
                        <p className="text-slate-500 font-medium">No appointments found</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Patient</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Reason</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAppointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-slate-900">{apt.patientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-700">{apt.date}</span>
                                            <span className="text-xs text-slate-500">{apt.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-sm text-slate-600">
                                        {apt.reason}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {apt.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(apt.id, 'confirmed')}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors tooltip-trigger"
                                                        title="Accept"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(apt.id, 'cancelled')}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Decline"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
