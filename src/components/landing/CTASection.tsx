"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Users, Award } from "lucide-react";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section className={`py-20 px-4 ${className}`}>
        <div className="container-custom">{children}</div>
    </section>
);

export const CTASection = () => {
    return (
        <Section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-center max-w-4xl mx-auto relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6"
                >
                    <Zap className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium text-text-secondary">Join 500+ Healthcare Providers</span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="text-gradient">Transforming Healthcare with AI-Powered Diagnostics</span>
                </h2>
                <p className="text-xl md:text-2xl text-text-secondary mb-10 leading-relaxed">
                    Join healthcare institutions and medical professionals leveraging AuraMed's advanced AI platform for enhanced diagnostic accuracy and improved patient outcomes.
                    Our FDA-cleared medical device is trusted by radiologists, oncologists, and healthcare systems worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <Link
                        href="/signup?role=doctor"
                        className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-primary/50 transition-all flex items-center gap-2 text-lg"
                    >
                        <span className="text-2xl">👨‍⚕️</span>
                        I'm a Healthcare Professional
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/patient/access"
                        className="group px-8 py-4 rounded-xl bg-gradient-to-r from-secondary to-cyan-600 text-white font-semibold hover:shadow-2xl hover:shadow-secondary/50 transition-all flex items-center gap-2 text-lg"
                    >
                        <span className="text-2xl">🏥</span>
                        I'm a Patient
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-8 text-sm text-text-tertiary mb-12"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span>HIPAA Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span>256-bit Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span>SOC 2 Type II Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span>FDA Cleared</span>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
                >
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gradient mb-2">99.5%</div>
                        <div className="text-sm text-text-tertiary">Diagnostic Accuracy</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gradient mb-2">70%</div>
                        <div className="text-sm text-text-tertiary">Time Reduction</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gradient mb-2">500+</div>
                        <div className="text-sm text-text-tertiary">Healthcare Facilities</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
                        <div className="text-sm text-text-tertiary">AI Availability</div>
                    </div>
                </motion.div>
            </motion.div>
        </Section>
    );
};