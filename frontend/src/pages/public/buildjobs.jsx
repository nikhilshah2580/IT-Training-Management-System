import { useState } from "react";
import { X, BriefcaseBusiness, Upload, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { createJobApplication } from "../../api/jobApplication.services";

const BuildJobs = ({ job, onClose }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("job", job?._id || "");
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("resume", file);
      await createJobApplication(payload);
      toast.success("Application submitted successfully");
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-md sm:px-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/60 bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Job application
            </p>
            <h2 className="mt-1 text-lg font-black text-slate-900">
              Apply with your resume
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            title="Close application"
          >
            <X size={19} />
          </button>
        </div>

        {job && (
          <div className="mb-4 rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness size={22} />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-wider text-indigo-100">
                  {job.companyName}
                </p>
                <p className="truncate text-lg font-black">{job.title}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-indigo-100">
              {job.description}
            </p>
          </div>
        )}

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <FileText className="h-7 w-7" />
          </div>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-600">
            Upload your resume to continue with this job application.
          </p>

          {/* Form Area */}
          <div className="mt-5 text-left">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Resume
            </label>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="rounded-xl border px-3 py-2.5 text-sm"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="rounded-xl border px-3 py-2.5 text-sm"
              />
              <input
                required
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                className="rounded-xl border px-3 py-2.5 text-sm"
              />
            </div>

            {/* Upload Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border transition-all ${
                isDragging
                  ? "border-purple-600 bg-purple-50/50"
                  : "border-gray-200 bg-white hover:border-purple-300"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.odt,.txt,image/*"
                onChange={handleFileChange}
                className="absolute inset-0 z-10 opacity-0 cursor-pointer"
              />

              {/* Upload Icon */}
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Upload className="h-5 w-5" />
              </div>

              {/* Upload Text or Selected File Details */}
              {file ? (
                <div className="text-center z-20">
                  <p className="text-sm font-semibold text-purple-600">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-purple-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    We support PDF, DOCX, ODT, TXT, and image files up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleUpload}
              disabled={isSubmitting}
              className="mt-5 w-full rounded-xl bg-purple-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildJobs;
