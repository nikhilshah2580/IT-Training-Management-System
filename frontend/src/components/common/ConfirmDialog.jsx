import { AlertTriangle, Loader2, X } from "lucide-react";

const ConfirmDialog = ({
  open,
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const toneStyles =
    tone === "danger"
      ? {
          icon: "border-red-100 bg-red-50 text-red-600",
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-200",
        }
      : {
          icon: "border-blue-100 bg-blue-50 text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-200",
        };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white text-center shadow-2xl ring-1 ring-black/5"
      >
        <div className="relative px-6 pb-4 pt-7">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close confirmation dialog"
          >
            <X size={18} />
          </button>

          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 ${toneStyles.icon}`}
          >
            <AlertTriangle size={30} strokeWidth={2.4} />
          </div>

          <h2
            id="confirm-dialog-title"
            className="text-xl font-bold tracking-normal text-slate-950"
          >
            {title}
          </h2>

          {message && (
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
              {message}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 disabled:opacity-60 ${toneStyles.button}`}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;