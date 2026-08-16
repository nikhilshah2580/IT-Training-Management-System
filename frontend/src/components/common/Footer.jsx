const Footer = () => {
    return (
        <footer className="border-t bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* About */}
                    <div>
                        <h2 className="text-xl font-bold text-white">Sipalaya Info Tech</h2>

                        <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
                            Empowering students with practical IT skills, professional training, and career
                            opportunities.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white">Quick Links</h3>

                        <div className="mt-3 flex flex-col gap-2 text-sm">
                            <a href="/courses" className="hover:text-white">
                                Courses
                            </a>

                            <a href="/demo-classes" className="hover:text-white">
                                Demo Classes
                            </a>

                            <a href="/blogs" className="hover:text-white">
                                Blogs
                            </a>

                            <a href="/job-listings" className="hover:text-white">
                                Job Listings
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white">Contact</h3>

                        <div className="mt-3 space-y-2 text-sm text-gray-400">
                            <p>Kathmandu, Nepal</p>

                            <p>info@sipalayainfotech.com</p>

                            <p>+977 9800000000</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Sipalaya Info Tech. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
