"use client";

import { motion } from "framer-motion";
import { Scan, Bot, ShieldCheck, BarChart, Calendar, Zap, Eye, Layers } from "lucide-react";

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay, duration: 0.6, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="glass p-8 rounded-2xl border border-white/10 hover:border-primary transition-all group shine-effect relative overflow-hidden h-full"
    >
        {/* Animated gradient background on hover */}
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ mixBlendMode: 'overlay' }}
        />

        <motion.div
            className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all shadow-lg"
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
        >
            {icon}
        </motion.div>
        <h3 className="font-bold text-xl mb-3 text-text-primary group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{description}</p>

        {/* Floating particles effect */}
        <motion.div
            className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"
        />
    </motion.div>
);

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section className={`py-20 px-4 ${className}`}>
        <div className="container-custom">{children}</div>
    </section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
        {children}
    </h2>
);

export const FeaturesSection = () => {
    const features = [
        {
            title: "AI-Powered Anomaly Detection",
            description:
                "Advanced medical imaging analysis powered by state-of-the-art AI models. Detects anomalies in CT, MRI, and X-Ray scans with high accuracy using deep learning algorithms trained on extensive medical datasets.",
            icon: <Zap size={24} />,
        },
        {
            title: "3D Medical Visualization",
            description:
                "Interactive 3D visualization with multi-planar reconstruction, volume rendering, and measurement tools. Supports DICOM, NIfTI, and other medical imaging formats for comprehensive analysis of complex anatomical structures.",
            icon: <Eye size={24} />,
        },
        {
            title: "Clinical Decision Support",
            description:
                "AI-powered diagnostic assistant providing evidence-based recommendations, differential diagnosis suggestions, and real-time access to medical literature. Integrates seamlessly with existing clinical workflows.",
            icon: <Bot size={24} />,
        },
        {
            title: "HIPAA-Compliant Secure Messaging",
            description:
                "End-to-end encrypted communication platform with role-based access controls, audit trails, and secure file sharing for medical images and reports. Fully compliant with healthcare data protection regulations.",
            icon: <ShieldCheck size={24} />,
        },
        {
            title: "Real-time Analytics Dashboard",
            description:
                "Comprehensive analytics with performance metrics, trend analysis, and customizable reporting. Monitor diagnostic accuracy, turnaround times, and patient outcomes with institutional benchmarking capabilities.",
            icon: <BarChart size={24} />,
        },
        {
            title: "Patient Health Timeline",
            description:
                "Longitudinal patient records with chronological medical history, appointment scheduling, medication tracking, and integrated health monitoring. Provides patients with accessible insights into their health journey.",
            icon: <Calendar size={24} />,
        },
        {
            title: "Multi-Modality Imaging Support",
            description:
                "Native support for CT, MRI, X-Ray, Ultrasound, PET, and specialized imaging formats. Handles DICOM, NIfTI, Analyze, and proprietary medical imaging formats with automatic format detection and conversion.",
            icon: <Layers size={24} />,
        },
        {
            title: "Collaborative Diagnostic Workflows",
            description:
                "Team-based diagnostic platforms with peer review capabilities, case assignments, and integrated consultation requests. Streamlines complex case management with configurable workflow automation.",
            icon: <Scan size={24} />,
        },
    ];

    return (
        <Section className="bg-surface/20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">Features</span>
                <SectionTitle>Why Healthcare Professionals Choose AuraMed</SectionTitle>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">Cutting-edge AI technology meets intuitive design for unparalleled diagnostic support</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, i) => (
                    <FeatureCard
                        key={i}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        delay={i * 0.1}
                    />
                ))}
            </div>
        </Section>
    );
};