"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Calendar,
    MessageSquare,
    Settings,
    LogOut,
    Bell
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [patientInfo, setPatientInfo] = useState<any>(null);

    useEffect(() => {
        // Load patient information from localStorage
        const storedPatientInfo = localStorage.getItem('patientInfo');
        if (storedPatientInfo) {
            setPatientInfo(JSON.parse(storedPatientInfo));
        }
    }, []);

    const handleSignOut = () => {
        // Clear all localStorage items related to user sessions
        localStorage.removeItem('patientInfo');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        
        // Redirect to login page
        router.push('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Health Overview", href: "/patient/dashboard" },
        { icon: FileText, label: "My Scans", href: "/patient/dashboard/timeline" },
        { icon: Calendar, label: "Appointments", href: "/patient/dashboard/appointments" },
        { icon: MessageSquare, label: "AI Companion", href: "/patient/dashboard/chat" },
        { icon: Settings, label: "Settings", href: "/patient/settings" },
    ];

    return (
        <div className="flex h-screen bg-background text-text-primary overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-white/5 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-cyan-500 flex items-center justify-center">
                        <span className="text-white font-bold">A</span>
                    </div>
                    <span className="font-bold text-xl">AuraMed</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-secondary/10 text-secondary"
                                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-patient"
                                        className="absolute left-0 w-1 h-8 bg-secondary rounded-r-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 border-b border-white/5 bg-surface/50 backdrop-blur-md flex items-center justify-between px-8">
                    <h2 className="text-lg font-medium text-text-secondary">Patient Portal</h2>

                    <div className="flex items-center gap-6">
                        <button className="relative text-text-secondary hover:text-secondary transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-medium">{patientInfo?.name || 'Patient'}</div>
                                <div className="text-xs text-text-secondary">Patient ID: #89201</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-cyan-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Profile" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}