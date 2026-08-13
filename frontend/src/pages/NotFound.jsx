import React from 'react'

import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-7xl font-bold text-gray-900">
                    404
                </h1>

                <p className="mt-4 text-xl text-gray-600">
                    Page not found.
                </p>

                <Link
                    to="/"
                    className="inline-block mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                >
                    Go Home
                </Link>
            </div>
        </main>
    );
};

export default NotFound;