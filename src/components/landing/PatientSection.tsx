"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, HeartPulse, Bot, Calendar, ShieldCheck, FileText, TrendingUp } from "lucide-react";
import { AICompanionUI } from "@/components/landing/AICompanionUI";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section className={`py-20 px-4 ${className}`}>
        <div className="container-custom">{children}</div>
    </section>
);

export const PatientSection = () => {
    return (
        <Section className="bg-gradient-to-br from-secondary/5 to-cyan-500/5">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="h-96 flex items-center justify-center order-2 md:order-1"
                >
                    <AICompanionUI />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="order-1 md:order-2 pl-8"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">For Patients</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Your Health, Understood and Empowered</h2>
                    <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                        Take control of your health journey with personalized insights, easy-to-understand reports, 
                        and 24/7 access to an empathetic AI companion for your medical questions.
                    </p>
                    <ul className="space-y-4 text-text-secondary mb-8">
                        <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-light/50 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                <HeartPulse size={20} className="text-secondary" />
                            </div>
                            <div>
                                <span className="text-base font-semibold text-text-primary">Simple Medical Scan Upload</span>
                                <p className="text-sm mt-1">Upload your medical scans with instant AI analysis and clear, jargon-free reports</p>
                            </div>
                        </motion.li>
                        <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-light/50 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot size={20} className="text-secondary" />
                            </div>
                            <div>
                                <span className="text-base font-semibold text-text-primary">Empathetic AI Companion</span>
                                <p className="text-sm mt-1">24/7 health assistant that explains medical concepts in simple terms and answers your questions</p>
                            </div>
                        </motion.li>
                        <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-light/50 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                <FileText size={20} className="text-secondary" />
                            </div>
                            <div>
                                <span className="text-base font-semibold text-text-primary">Personalized Health Reports</span>
                                <p className="text-sm mt-1">Easy-to-understand medical reports with visualizations and actionable insights</p>
                            </div>
                        </motion.li>
                        <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-light/50 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                <TrendingUp size={20} className="text-secondary" />
                            </div>
                            <div>
                                <span className="text-base font-semibold text-text-primary">Health Timeline</span>
                                <p className="text-sm mt-1">Complete medical history with upcoming appointments and health trend tracking</p>
                            </div>
                        </motion.li>
                    </ul>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link
                            href="/signup?role=patient"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-white font-semibold hover:shadow-lg transition-all"
                        >
                            Get Started as Patient
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/patient/access"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-secondary/30 text-text-primary hover:bg-secondary/10 transition-all"
                        >
                            <ShieldCheck size={18} />
                            Secure Access
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </Section>
    );
};