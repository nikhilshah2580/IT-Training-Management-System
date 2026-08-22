import { useEffect, useState } from "react";
import { Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getMyPayments } from "../../api/payment.services";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyPayments();
        const paymentData = response?.payments || response?.data?.payments || [];
        setPayments(Array.isArray(paymentData) ? paymentData : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load your payments.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto text-red-600" size={32} />
        <h2 className="mt-4 text-lg font-bold text-red-800">Unable to load payments</h2>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 text-white shadow-xl">
        <h1 className="text-2xl font-black tracking-tight">My Payments</h1>
        <p className="mt-2 text-sm text-indigo-100">
          Track your course payments and download invoices whenever needed.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          No payment records yet.
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{payment.course?.title || "Course"}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Invoice: {payment.invoiceNumber || "-"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                    payment.paymentStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : payment.paymentStatus === "Failed"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {payment.paymentStatus === "Paid" && <CheckCircle2 size={12} />}
                    {payment.paymentStatus || "Pending"}
                  </span>

                  <a
                    href={`${import.meta.env.VITE_API_URL || "http://localhost:9100/api"}/payments/${payment._id}/invoice`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    <Download size={14} />
                    Invoice
                  </a>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-xs text-slate-600 md:grid-cols-4">
                <div>
                  <p className="text-slate-400">Amount</p>
                  <p className="mt-1 font-semibold text-slate-800">Rs. {Number(payment.amount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Method</p>
                  <p className="mt-1 font-semibold text-slate-800">{payment.paymentMethod || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-400">Transaction</p>
                  <p className="mt-1 font-semibold text-slate-800 break-all">{payment.transactionId || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-400">Paid At</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payment;
