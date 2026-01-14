"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section className={`py-20 px-4 ${className}`}>
        <div className="container-custom">{children}</div>
    </section>
);

const TestimonialCard = ({ 
    quote, 
    author, 
    role, 
    hospital,
    rating,
    delay 
}: { 
    quote: string; 
    author: string; 
    role: string; 
    hospital: string;
    rating: number;
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay, duration: 0.6 }}
        className="glass p-8 rounded-2xl border border-white/10 hover:border-primary transition-all group relative overflow-hidden"
    >
        <div className="absolute top-4 right-4 text-primary/10">
            <Quote size={40} />
        </div>
        
        <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    size={20} 
                    className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"} 
                />
            ))}
        </div>
        
        <p className="text-text-secondary mb-6 italic">"{quote}"</p>
        
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {author.charAt(0)}
            </div>
            <div>
                <h4 className="font-bold text-text-primary">{author}</h4>
                <p className="text-sm text-text-secondary">{role}</p>
                <p className="text-xs text-text-tertiary">{hospital}</p>
            </div>
        </div>
    </motion.div>
);

export const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "AuraMed's AI detection has reduced our diagnostic time by 70% while improving accuracy. The 3D visualization tools are exceptional for complex cases.",
            author: "Dr. Sarah Johnson",
            role: "Chief Radiologist",
            hospital: "Johns Hopkins Hospital",
            rating: 5
        },
        {
            quote: "As a patient, I appreciate how AuraMed explains my scans in simple terms while still providing professional medical insights. The AI companion is truly helpful.",
            author: "Michael Chen",
            role: "Patient",
            hospital: "Regular User",
            rating: 5
        },
        {
            quote: "The integration with our existing PACS system was seamless. Our radiologists report higher job satisfaction and diagnostic confidence since implementation.",
            author: "Dr. Robert Garcia",
            role: "Medical Director",
            hospital: "Cleveland Clinic",
            rating: 5
        }
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
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                    Testimonials
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="text-gradient">Trusted by Healthcare Leaders</span>
                </h2>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                    Join thousands of medical professionals who trust AuraMed for enhanced diagnostic capabilities
                </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, i) => (
                    <TestimonialCard
                        key={i}
                        quote={testimonial.quote}
                        author={testimonial.author}
                        role={testimonial.role}
                        hospital={testimonial.hospital}
                        rating={testimonial.rating}
                        delay={i * 0.1}
                    />
                ))}
            </div>
        </Section>
    );
};