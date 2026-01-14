'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('doctor');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', role);
      
      if (role === 'doctor') {
        router.push('/doctor/dashboard');
      } else {
        // Patients don't need to login, they just need to provide information
        router.push('/patient/access');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
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

        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-text-secondary text-center mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">I am a</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`py-2 px-4 rounded-lg border transition-all ${
                  role === 'patient'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-surface-light border-border/50 text-text-secondary hover:border-primary'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`py-2 px-4 rounded-lg border transition-all ${
                  role === 'doctor'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-surface-light border-border/50 text-text-secondary hover:border-primary'
                }`}
              >
                Doctor
              </button>
            </div>
          </div>
          
          {/* Only show email/password fields for doctors */}
          {role === 'doctor' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-surface-light border border-border/50 focus:border-primary outline-none transition-colors placeholder:text-text-secondary"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg bg-gradient-primary text-text-primary font-semibold hover:shadow-lg disabled:opacity-50 transition-all btn-hover"
          >
            {isLoading ? 'Processing...' : 
             role === 'doctor' ? 'Sign In as Doctor' : 'Continue to Patient Dashboard'}
          </button>
        </form>

        <p className="text-center text-text-secondary mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-secondary transition-colors">
            Sign up
          </Link>
        </p>
        
        {role === 'patient' && (
          <p className="text-center text-text-secondary text-sm mt-4">
            Patients don't need to login. You'll just provide your information to access your dashboard.
          </p>
        )}
      </motion.div>
    </main>
  );
}