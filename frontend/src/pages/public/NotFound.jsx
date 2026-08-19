import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <main>
      <section className="flex min-h-screen flex-col items-center justify-center bg-linear-to-r from-red-500 to-pink-600 px-6 text-white">
        <h1 className="mb-4 text-8xl font-bold">404</h1>
        <h2 className="mb-6 text-4xl font-bold">Page Not Found</h2>
        <p className="mb-8 max-w-md text-center text-xl">
          Sorry! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-white px-8 py-3 font-bold text-red-600 transition duration-300 hover:bg-gray-100"
        >
          Go Back Home
        </Link>
      </section>
    </main>
  );
};

export default PageNotFound;
