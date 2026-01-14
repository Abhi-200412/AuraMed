'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PatientAccessPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contact: '',
    email: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Store patient information in localStorage
    localStorage.setItem('patientInfo', JSON.stringify(formData));
    
    // Redirect to patient dashboard
    setTimeout(() => {
      router.push('/patient/dashboard');
      setIsLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-md w-full p-8 rounded-xl"
      >
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center group">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-text-primary font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl text-gradient">AuraMed</span>
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-center">Patient Access</h1>
        <p className="text-text-secondary text-center mb-8">Provide your information to access your dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Age *</label>
            <input
              type="number"
              name="age"
              required
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Number *</label>
            <input
              type="tel"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <textarea
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
              placeholder="123 Main Street, City, State, ZIP"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg bg-gradient-primary text-text-primary font-semibold hover:shadow-lg disabled:opacity-50 transition-all btn-hover"
          >
            {isLoading ? 'Processing...' : 'Access Dashboard'}
          </button>
        </form>

        <p className="text-center text-text-secondary mt-6">
          <Link href="/login" className="text-primary hover:text-secondary transition-colors">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
}