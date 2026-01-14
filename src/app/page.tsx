"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { DoctorSection } from "@/components/landing/DoctorSection";
import { PatientSection } from "@/components/landing/PatientSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-background text-text-primary min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <DoctorSection />
      <PatientSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </main>
  );
}