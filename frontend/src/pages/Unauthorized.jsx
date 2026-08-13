import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-5xl font-bold">403</h1>

                <p className="mt-4 text-gray-600">You are not authorized to access this page.</p>

                <Link to="/" className="inline-block mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white">
                    Go Home
                </Link>
            </div>
        </main>
    );
};

export default Unauthorized;
