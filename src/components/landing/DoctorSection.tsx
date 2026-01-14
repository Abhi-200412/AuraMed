"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Bot, BarChart, Eye, Zap, Layers, Users } from "lucide-react";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section className={`py-20 px-4 ${className}`}>
        <div className="container-custom">{children}</div>
    </section>
);

export const DoctorSection = () => {
    return (
        <Section className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="pr-8">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">For Doctors</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Advanced Diagnostic Tools for Medical Professionals</h2>
                        <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                            Enhance your diagnostic capabilities with our suite of AI-powered tools. From automated anomaly detection to comprehensive analytics dashboards, 
                            AuraMed is your partner in delivering superior patient care with precision and efficiency.
                        </p>
                        <ul className="space-y-4 text-text-secondary mb-8">
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-light/50 transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Zap size={20} className="text-primary" />
                                </div>
                                <div>
                                    <span className="text-base font-semibold text-text-primary">AI-Powered Anomaly Detection</span>
                                    <p className="text-sm mt-1">99.5% accuracy in identifying potential medical anomalies across CT, MRI, and X-Ray scans</p>
                                </div>
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-light/50 transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Eye size={20} className="text-primary" />
                                </div>
                                <div>
                                    <span className="text-base font-semibold text-text-primary">Advanced 3D Visualization</span>
                                    <p className="text-sm mt-1">Interactive 3D medical imaging with measurement tools and multi-planar reconstruction</p>
                                </div>
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-light/50 transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <BarChart size={20} className="text-primary" />
                                </div>
                                <div>
                                    <span className="text-base font-semibold text-text-primary">Comprehensive Analytics Dashboard</span>
                                    <p className="text-sm mt-1">Real-time performance metrics, trend analysis, and customizable reporting tools</p>
                                </div>
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-light/50 transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Users size={20} className="text-primary" />
                                </div>
                                <div>
                                    <span className="text-base font-semibold text-text-primary">Collaborative Workflows</span>
                                    <p className="text-sm mt-1">Peer review capabilities, case assignments, and integrated consultation requests</p>
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
                                href="/signup?role=doctor"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition-all"
                            >
                                Get Started as Doctor
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/documentation"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary/30 text-text-primary hover:bg-primary/10 transition-all"
                            >
                                View Documentation
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex items-center justify-center"
                >
                    <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                        {/* Background Image */}
                        <img
                            src="/ct-scan-sample.png"
                            alt="AI Analysis CT Scan"
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                        {/* UI Overlays */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                <div className="text-xs text-text-tertiary uppercase tracking-wider">Patient ID</div>
                                <div className="text-sm font-mono text-primary">#89201-LVR</div>
                            </div>
                            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-green-500">ANALYSIS ACTIVE</span>
                            </div>
                        </div>

                        {/* Scanning Line Animation */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="w-full h-1/2 bg-gradient-to-b from-transparent to-primary/20 border-b-2 border-primary/50 absolute top-0 animate-scan" />
                        </div>

                        {/* Analysis Results Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-4 rounded-xl border border-white/10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-text-primary">Hepatic Lesion Detected</span>
                                <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">98.2% Confidence</span>
                            </div>
                            <div className="w-full bg-surface-light h-1.5 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-red-500 w-[98%]" />
                            </div>
                            <div className="text-xs text-text-secondary">
                                <p className="mb-1">Location: Segment VII of the liver</p>
                                <p>Size: 24mm x 18mm x 21mm</p>
                            </div>
                        </div>
                        
                        {/* Additional UI Elements */}
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-surface/90 backdrop-blur-md p-3 rounded-lg border border-white/10">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Layers size={16} className="text-primary" />
                                    <span className="text-xs">CT Scan</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bot size={16} className="text-secondary" />
                                    <span className="text-xs">AI Analysis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
};