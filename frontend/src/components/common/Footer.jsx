import { Link } from "react-router-dom";
import {
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16">

                    {/* Brand / About */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-2xl font-bold text-white tracking-wide">Sipalaya InfoTech</h2>
                        <p className="text-sm font-semibold text-blue-400 tracking-wider">
                            Empowering Talent. Building Digital Excellence
                        </p>
                        <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
                            Since 2022, we've trained 1,200+ students and delivered data, web, mobile, and software solutions to 100+ clients, driving innovation and business growth.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center space-x-3 pt-2">
                            {/* Facebook */}
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-2.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            {/* Twitter / X */}
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="p-2.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            {/* LinkedIn */}
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                            {/* Instagram */}
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-2.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            {/* YouTube */}
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="p-2.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Courses */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Courses</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/courses/python" className="text-gray-400 hover:text-white transition-colors">Python for Data Science</Link></li>
                            <li><Link to="/courses/data-analytics" className="text-gray-400 hover:text-white transition-colors">Data Analytics & BI</Link></li>
                            <li><Link to="/courses/ml-ai" className="text-gray-400 hover:text-white transition-colors">Machine Learning & AI</Link></li>
                            <li><Link to="/courses/data-engineering" className="text-gray-400 hover:text-white transition-colors">Data Engineering</Link></li>
                            <li><Link to="/courses/gen-ai" className="text-gray-400 hover:text-white transition-colors">Generative AI & LLM</Link></li>
                            <li><Link to="/courses/sql" className="text-gray-400 hover:text-white transition-colors">SQL & Database Analytics</Link></li>
                        </ul>
                    </div>

                    {/* Career & About */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Career & About</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/job-assistance" className="text-gray-400 hover:text-white transition-colors">Job Assistance</Link></li>
                            <li><Link to="/internships" className="text-gray-400 hover:text-white transition-colors">Internship Programs</Link></li>
                            <li><Link to="/success-stories" className="text-gray-400 hover:text-white transition-colors">Success Stories</Link></li>
                            <li><Link to="/hiring-partners" className="text-gray-400 hover:text-white transition-colors">Hiring Partners</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Company Overview</Link></li>
                            <li><Link to="/mission" className="text-gray-400 hover:text-white transition-colors">Mission & Vision</Link></li>
                            <li><Link to="/team" className="text-gray-400 hover:text-white transition-colors">Our Team</Link></li>
                            <li><Link to="/why-choose-us" className="text-gray-400 hover:text-white transition-colors">Why Choose Us</Link></li>
                        </ul>
                    </div>

                    {/* Support & Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support & Contact</h3>
                        <ul className="space-y-2.5 text-sm text-gray-400 mb-6">
                            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>

                        <div className="space-y-3 text-sm text-gray-400">
                            <div className="flex items-start gap-2.5">
                                <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                                <span>Narephat-32, Koteshwor, Kathmandu</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone size={18} className="text-blue-500 shrink-0" />
                                <a href="tel:9851344071" className="hover:text-white transition-colors">9851344071</a>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail size={18} className="text-blue-500 shrink-0" />
                                <a href="mailto:infotech@sipalaya.com" className="hover:text-white transition-colors">infotech@sipalaya.com</a>
                            </div>
                            <div className="pt-1">
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    View on Google Maps <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 pt-8 border-t border-gray-800">
                    <p>© {new Date().getFullYear()} Sipalaya InfoTech. All rights reserved.</p>

                    <div className="flex items-center space-x-4">
                        <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <span className="text-gray-700">|</span>
                        <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms & Conditions</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;