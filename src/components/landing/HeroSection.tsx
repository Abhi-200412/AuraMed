"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Stethoscope, Brain, Zap } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background" />
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6"
        >
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-text-secondary">Powered by Advanced AI Technology</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-gradient">AI-Powered</span>
          <br />
          Medical Imaging
          <br />
          <span className="text-3xl md:text-5xl text-text-secondary">for Precision Diagnostics</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Transform medical diagnostics with advanced AI analysis. Secure,
          precise, and designed for modern healthcare professionals and
          patients. Experience 99.5% accuracy in anomaly detection.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link
            href="/signup?role=doctor"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-2xl hover:shadow-primary/50 transition-all flex items-center gap-2 text-lg"
          >
            Get Started Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/research"
            className="group px-8 py-4 rounded-xl border-2 border-primary/30 text-text-primary hover:bg-primary/10 hover:border-primary font-semibold transition-all text-lg glass flex items-center gap-2"
          >
            <Play size={20} className="text-primary" />
            View Research
          </Link>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-gradient mb-1">99.5%</div>
            <div className="text-sm text-text-tertiary">Accuracy Rate</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-gradient mb-1">10K+</div>
            <div className="text-sm text-text-tertiary">Scans Analyzed</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-gradient mb-1">500+</div>
            <div className="text-sm text-text-tertiary">Healthcare Providers</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
            <div className="text-sm text-text-tertiary">AI Availability</div>
          </div>
        </motion.div>
        
        {/* Medical Specialties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-16"
        >
          <h3 className="text-lg font-semibold text-text-secondary mb-6">Specialized for Multiple Medical Disciplines</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 backdrop-blur-sm border border-white/10">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm">Neurology</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 backdrop-blur-sm border border-white/10">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span className="text-sm">Cardiology</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 backdrop-blur-sm border border-white/10">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-white font-bold">L</span>
              </div>
              <span className="text-sm">Liver Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 backdrop-blur-sm border border-white/10">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-white font-bold">B</span>
              </div>
              <span className="text-sm">Breast Imaging</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};