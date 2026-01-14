'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: (roleParam as 'doctor' | 'patient') || 'doctor',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.role === 'patient') {
      // Patients don't need to create accounts, just redirect to access page
      router.push('/patient/access');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Simulate signup for doctors
    setTimeout(() => {
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userRole', formData.role);
      
      if (formData.role === 'doctor') {
        router.push('/doctor/dashboard');
      } else {
        router.push('/patient/access');
      }
      setIsLoading(false);
    }, 1000);
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

        <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-text-secondary text-center mb-8">Join AuraMed today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">I am a</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'patient'})}
                className={`py-2 px-4 rounded-lg border transition-all ${
                  formData.role === 'patient'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-surface-light border-border/50 text-text-secondary hover:border-primary'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'doctor'})}
                className={`py-2 px-4 rounded-lg border transition-all ${
                  formData.role === 'doctor'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-surface-light border-border/50 text-text-secondary hover:border-primary'
                }`}
              >
                Doctor
              </button>
            </div>
          </div>
          
          {/* Only show form fields for doctors */}
          {formData.role === 'doctor' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
                  placeholder="••••••••"
                />
              </div>
            </>
          ) : (
            <div className="bg-surface-light/50 border border-primary/20 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Patient Access</h3>
              <p className="text-text-secondary mb-4">
                Patients don't need to create accounts. You'll just provide your information to access your dashboard.
              </p>
              <p className="text-text-secondary text-sm">
                Your information is kept private and secure. No login credentials required.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg bg-gradient-primary text-text-primary font-semibold hover:shadow-lg disabled:opacity-50 transition-all btn-hover"
          >
            {isLoading ? 'Processing...' : 
             formData.role === 'doctor' ? 'Create Doctor Account' : 'Continue to Patient Dashboard'}
          </button>
        </form>

        <p className="text-center text-text-secondary mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-secondary transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="glass max-w-md w-full p-8 rounded-xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface-light rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-surface-light rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </main>
    }>
      <SignupForm />
    </Suspense>
  );
}