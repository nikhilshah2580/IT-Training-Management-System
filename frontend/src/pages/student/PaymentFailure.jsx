import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentFailure = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
        <XCircle className="mx-auto text-red-600" size={54} />
        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Payment Failed
        </h1>
        <p className="mt-3 text-gray-600">
          eSewa could not complete the payment. You can try enrolling again from
          the course page.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/courses"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Browse Courses
          </Link>
          <Link
            to="/student/enrollments"
            className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Enrollments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
