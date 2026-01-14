"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Bell,
    Search
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [doctorInfo, setDoctorInfo] = useState<any>(null);

    useEffect(() => {
        // Load doctor information from localStorage
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setDoctorInfo({ 
                name: storedEmail.split('@')[0], // Use email prefix as name
                email: storedEmail 
            });
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
        { icon: LayoutDashboard, label: "Dashboard", href: "/doctor/dashboard" },
        { icon: Users, label: "Patients", href: "/doctor/patients" },
        { icon: FileText, label: "Upload Scan", href: "/doctor/dashboard/upload" },
        { icon: Settings, label: "Settings", href: "/doctor/settings" },
    ];

    return (
        <div className="flex h-screen bg-background text-text-primary overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-white/5 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
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
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
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
                    <div className="flex items-center gap-4 bg-surface-light/50 px-4 py-2 rounded-lg border border-white/5 w-96">
                        <Search size={18} className="text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search patients, scans, or reports..."
                            className="bg-transparent border-none outline-none text-sm w-full text-text-primary placeholder:text-text-secondary"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-text-secondary hover:text-primary transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-medium">{doctorInfo?.name || 'Doctor'}</div>
                                <div className="text-xs text-text-secondary">Radiologist</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Profile" />
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