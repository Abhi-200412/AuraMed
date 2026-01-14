'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, Plus } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  location: string;
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 'APT-001',
    date: '2025-11-25',
    time: '10:30 AM',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Radiology',
    status: 'confirmed',
    location: 'Main Campus - Room 204',
    notes: 'Follow-up CT scan review'
  },
  {
    id: 'APT-002',
    date: '2025-11-28',
    time: '2:15 PM',
    doctor: 'Dr. Michael Chen',
    specialty: 'Hepatology',
    status: 'confirmed',
    location: 'Main Campus - Room 312',
    notes: 'Liver function test results discussion'
  },
  {
    id: 'APT-003',
    date: '2025-11-18',
    time: '9:00 AM',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'General Medicine',
    status: 'completed',
    location: 'Main Campus - Room 105',
    notes: 'Annual physical examination'
  },
  {
    id: 'APT-004',
    date: '2025-11-10',
    time: '11:45 AM',
    doctor: 'Dr. James Wilson',
    specialty: 'Radiology',
    status: 'cancelled',
    location: 'Main Campus - Room 204',
    notes: 'Post-scan consultation'
  }
];

export default function AppointmentsPage() {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return appointment.status === 'confirmed';
    if (filter === 'completed') return appointment.status === 'completed';
    if (filter === 'cancelled') return appointment.status === 'cancelled';
    return true;
  });

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-yellow-500/10 text-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-text-secondary mt-2">
            View and manage your upcoming medical appointments
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          <Plus size={20} />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface-light hover:bg-surface text-text-secondary'
          }`}
        >
          All Appointments
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-green-500/20 text-green-500'
              : 'bg-surface-light hover:bg-surface text-text-secondary'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-blue-500/20 text-blue-500'
              : 'bg-surface-light hover:bg-surface text-text-secondary'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'cancelled'
              ? 'bg-red-500/20 text-red-500'
              : 'bg-surface-light hover:bg-surface text-text-secondary'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Appointments List */}
      <div className="grid gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No appointments found</h3>
            <p className="text-text-secondary mb-4">
              {filter === 'all'
                ? "You don't have any appointments scheduled."
                : `You don't have any ${filter} appointments.`}
            </p>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Book New Appointment
            </button>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl border border-white/5 p-6 hover:border-white/10 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-bold">
                        {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-lg font-bold">
                        {new Date(appointment.date).getDate()}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{appointment.doctor}</h3>
                      <span className="text-text-secondary">•</span>
                      <span className="text-text-secondary">{appointment.specialty}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <p className="text-text-secondary text-sm">{appointment.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                  <div className="flex gap-2">
                    {appointment.status === 'confirmed' && (
                      <>
                        <button className="px-3 py-1 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                          Reschedule
                        </button>
                        <button className="px-3 py-1 text-sm rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                          Cancel
                        </button>
                      </>
                    )}
                    {appointment.status === 'completed' && (
                      <button className="px-3 py-1 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}