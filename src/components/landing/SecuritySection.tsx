"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Key, Server, Database, FileText } from "lucide-react";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section className={`py-20 px-4 ${className}`}>
        <div className="container-custom">{children}</div>
    </section>
);

const SecurityFeature = ({ 
    icon, 
    title, 
    description,
    delay 
}: { 
    icon: React.ReactNode; 
    title: string; 
    description: string;
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay, duration: 0.6 }}
        whileHover={{ y: -8 }}
        className="glass p-6 rounded-xl border border-white/10 hover:border-primary transition-all group"
    >
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
            {icon}
        </div>
        <h3 className="font-bold text-lg mb-2 text-text-primary">{title}</h3>
        <p className="text-text-secondary text-sm">{description}</p>
    </motion.div>
);

export const SecuritySection = () => {
    const features = [
        {
            title: "HIPAA Compliant",
            description: "Fully compliant with Health Insurance Portability and Accountability Act regulations for patient data protection.",
            icon: <ShieldCheck size={24} />
        },
        {
            title: "End-to-End Encryption",
            description: "All data transmission and storage encrypted with 256-bit AES encryption, the same standard used by banks.",
            icon: <Lock size={24} />
        },
        {
            title: "Role-Based Access",
            description: "Granular access controls ensure only authorized personnel can view sensitive medical information.",
            icon: <Key size={24} />
        },
        {
            title: "Secure Infrastructure",
            description: "SOC 2 Type II certified infrastructure with regular security audits and penetration testing.",
            icon: <Server size={24} />
        },
        {
            title: "Data Residency",
            description: "Patient data stored in region-specific data centers to comply with local data protection laws.",
            icon: <Database size={24} />
        },
        {
            title: "Audit Trails",
            description: "Comprehensive logging of all system access and data modifications for compliance reporting.",
            icon: <FileText size={24} />
        }
    ];

    return (
        <Section>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                    Security & Compliance
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="text-gradient">Enterprise-Grade Security</span>
                </h2>
                <p className="text-text-secondary text-lg max-w-3xl mx-auto">
                    Your patient data is protected with the highest security standards in the healthcare industry. 
                    We implement comprehensive safeguards to ensure privacy and compliance.
                </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                    <SecurityFeature
                        key={i}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        delay={i * 0.1}
                    />
                ))}
            </div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20"
            >
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-4 text-text-primary">Comprehensive Compliance Framework</h3>
                        <p className="text-text-secondary mb-4">
                            AuraMed maintains strict compliance with healthcare regulations globally, including HIPAA, GDPR, 
                            and other regional data protection laws. Our security team conducts regular audits and updates 
                            to ensure continuous compliance.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">HIPAA</span>
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">SOC 2 Type II</span>
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">GDPR</span>
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">21 CFR Part 11</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <ShieldCheck size={64} className="text-white" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Section>
    );
};