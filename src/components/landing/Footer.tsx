"use client";

export const Footer = () => {
    return (
        <footer className="border-t border-border/20 py-12 text-text-secondary bg-surface/50">
            <div className="container-custom">
                <div className="grid md:grid-cols-5 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <span className="font-bold text-xl text-gradient">AuraMed</span>
                        </div>
                        <p className="text-sm mb-4 max-w-md leading-relaxed">
                            Revolutionizing healthcare through AI-powered medical imaging analysis.
                            Trusted by healthcare institutions worldwide for enhanced diagnostic accuracy and improved patient outcomes.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-surface hover:bg-primary/20 flex items-center justify-center transition-all">
                                <span className="text-xl">🐦</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-surface hover:bg-primary/20 flex items-center justify-center transition-all">
                                <span className="text-xl">💼</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-surface hover:bg-primary/20 flex items-center justify-center transition-all">
                                <span className="text-xl">📹</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Solutions</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Technical Documentation</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Research Publications</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Clinical Studies</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Webinars</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">About AuraMed</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Press & Media</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; 2024 AuraMed. All rights reserved. | FDA Cleared Class II Medical Device | HIPAA Compliant | ISO 13485 Certified</p>
                    <div className="flex flex-wrap gap-6 justify-center">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Regulatory Compliance</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};