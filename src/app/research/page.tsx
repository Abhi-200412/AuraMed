'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  BarChart3,
  Users,
  Award,
  Microscope,
  Download,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const Section = ({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section className={`py-16 px-4 ${className}`} id={id}>
    <div className="container-custom">{children}</div>
  </section>
);

const ResearchCard = ({
  title,
  description,
  type,
  link,
  delay
}: {
  title: string;
  description: string;
  type: string;
  link?: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ delay, duration: 0.6 }}
    className="glass p-6 rounded-xl border border-white/10 hover:border-primary transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">{title}</h3>
      {link ? (
        <ExternalLink size={18} className="text-primary" />
      ) : (
        <Download size={18} className="text-primary" />
      )}
    </div>
    <p className="text-text-secondary text-sm mb-4">{description}</p>
    <div className="flex justify-between items-center">
      <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{type}</span>
      {link ? (
        <a href={link} className="text-sm text-primary hover:underline">View Publication</a>
      ) : (
        <button className="text-sm text-primary hover:underline flex items-center gap-1">
          Download <Download size={14} />
        </button>
      )}
    </div>
  </motion.div>
);

const StatsCard = ({
  number,
  label,
  description,
  delay
}: {
  number: string;
  label: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="text-center p-6 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/10"
  >
    <div className="text-3xl font-bold text-gradient mb-2">{number}</div>
    <h3 className="font-semibold text-text-primary mb-2">{label}</h3>
    <p className="text-sm text-text-secondary">{description}</p>
  </motion.div>
);

export default function ResearchPage() {
  const researchPapers = [
    {
      title: "Deep Learning-Based Anomaly Detection in Medical Imaging: A Comprehensive Study",
      description: "Evaluating the performance of advanced AI models for detecting anomalies in CT and MRI scans across multiple medical institutions.",
      type: "Clinical Study",
      delay: 0.1
    },
    {
      title: "Comparative Analysis of AI-Assisted Diagnosis vs Traditional Radiology Methods",
      description: "A multi-center study comparing diagnostic accuracy and time efficiency between AI-assisted and traditional radiology approaches.",
      type: "Peer-Reviewed Paper",
      delay: 0.2
    },
    {
      title: "Integration of AI Frameworks in Clinical Workflows: Implementation Guide",
      description: "Technical documentation on integrating AI-powered diagnostic tools into existing hospital information systems.",
      type: "Technical Report",
      delay: 0.3
    },
    {
      title: "Patient Outcomes Improvement Through AI-Powered Diagnostic Support",
      description: "Longitudinal study tracking patient outcomes before and after implementation of AI diagnostic assistance tools.",
      type: "Clinical Trial",
      delay: 0.4
    }
  ];

  const researchStats = [
    {
      number: "99.5%",
      label: "Diagnostic Accuracy",
      description: "Achieved in controlled clinical trials across 500+ cases",
      delay: 0.1
    },
    {
      number: "72%",
      label: "Time Reduction",
      description: "Average reduction in diagnostic time for radiologists",
      delay: 0.2
    },
    {
      number: "15+",
      label: "Research Partners",
      description: "Academic and medical institutions collaborating with us",
      delay: 0.3
    },
    {
      number: "500K+",
      label: "Images Analyzed",
      description: "Training dataset size for our AI models",
      delay: 0.4
    }
  ];

  return (
    <main className="bg-background text-text-primary min-h-screen">
      {/* Hero Section */}
      <Section className="pt-20 pb-16 bg-gradient-to-b from-primary/5 to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Research & Publications
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Advancing Medical AI Through Rigorous Research</span>
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-3xl mx-auto">
            Our commitment to evidence-based innovation drives continuous improvement in diagnostic accuracy
            and patient outcomes through collaborative research with leading medical institutions.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#publications"
              className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition-all"
            >
              View Publications
            </Link>
            <Link
              href="#collaborations"
              className="px-6 py-3 rounded-lg border-2 border-primary/30 text-text-primary hover:bg-primary/10 transition-all"
            >
              Our Partners
            </Link>
          </div>
        </motion.div>
      </Section>

      {/* Research Stats */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Research Impact</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Quantifiable results from our ongoing research initiatives and clinical trials
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {researchStats.map((stat, i) => (
            <StatsCard
              key={i}
              number={stat.number}
              label={stat.label}
              description={stat.description}
              delay={stat.delay}
            />
          ))}
        </div>
      </Section>

      {/* Research Areas */}
      <Section className="bg-surface/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Research Focus Areas</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Our research spans multiple domains of medical AI and diagnostic innovation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="glass p-6 rounded-xl border border-white/10 hover:border-primary transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <BarChart3 size={24} />
            </div>
            <h3 className="font-bold text-xl mb-3">Clinical Validation</h3>
            <p className="text-text-secondary">
              Conducting rigorous clinical trials to validate diagnostic accuracy and safety of our AI tools in real-world settings.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass p-6 rounded-xl border border-white/10 hover:border-primary transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-xl mb-3">Human-AI Collaboration</h3>
            <p className="text-text-secondary">
              Studying optimal integration of AI tools into clinical workflows to enhance, not replace, healthcare professional expertise.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Publications */}
      <Section id="publications">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <FileText size={16} />
            <span>Peer-Reviewed Publications</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Research Publications</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Our latest research findings and technical documentation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {researchPapers.map((paper, i) => (
            <ResearchCard
              key={i}
              title={paper.title}
              description={paper.description}
              type={paper.type}
              delay={paper.delay}
            />
          ))}
        </div>
      </Section>

      {/* Collaboration */}
      <Section className="bg-gradient-to-br from-primary/10 to-secondary/10" id="collaborations">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Users size={16} />
            <span>Academic Partnerships</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Research Collaborations</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            We partner with leading academic institutions and medical centers to advance medical AI research
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="glass p-8 rounded-xl border border-white/10"
          >
            <h3 className="font-bold text-2xl mb-4">Key Research Partners</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">Academic Institutions</h4>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    <span>Harvard Medical School</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    <span>Johns Hopkins School of Medicine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    <span>Stanford University School of Medicine</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Medical Centers</h4>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    <span>Mayo Clinic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    <span>Cleveland Clinic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    <span>Massachusetts General Hospital</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20"
        >
          <BookOpen size={48} className="text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Access Our Complete Research Library</h2>
          <p className="text-text-secondary mb-6">
            Download our comprehensive research papers, technical documentation, and clinical trial results
            to learn more about our evidence-based approach to medical AI development.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Download size={18} />
              Download Research Package
            </button>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg border-2 border-primary/30 text-text-primary hover:bg-primary/10 transition-all"
            >
              Contact Our Research Team
            </Link>
          </div>
        </motion.div>
      </Section>
    </main>
  );
}