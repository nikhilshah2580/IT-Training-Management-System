import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { verifyEsewaPayment } from "../../api/payment.services";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your eSewa payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const data = searchParams.get("data");

      if (!data) {
        setStatus("error");
        setMessage("Payment response data was not received from eSewa.");
        return;
      }

      try {
        await verifyEsewaPayment(data);
        setStatus("success");
        setMessage("Payment successful. Your course enrollment is now active.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error?.response?.data?.message || "Payment verification failed.",
        );
      }
    };

    verifyPayment();
  }, [searchParams]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
        {isLoading ? (
          <Loader2 className="mx-auto animate-spin text-blue-600" size={48} />
        ) : isSuccess ? (
          <CheckCircle2 className="mx-auto text-green-600" size={54} />
        ) : (
          <XCircle className="mx-auto text-red-600" size={54} />
        )}

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          {isLoading
            ? "Verifying Payment"
            : isSuccess
              ? "Payment Successful"
              : "Verification Failed"}
        </h1>
        <p className="mt-3 text-gray-600">{message}</p>

        {!isLoading && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/student/my-courses"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              My Courses
            </Link>
            <Link
              to="/student/enrollments"
              className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Enrollments
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
