import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getErrorMessage } from "../../utils/toast";

const emptyValues = (fields = []) =>
  fields.reduce(
    (values, field) => ({ ...values, [field.name]: field.defaultValue ?? "" }),
    {},
  );

const readList = (data, keys) => {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }
  return [];
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "-";

const matchesSearch = (row, search) =>
  !search.trim() ||
  JSON.stringify(row).toLowerCase().includes(search.toLowerCase().trim());

const AdminModulePage = ({
  title,
  description,
  queryKey,
  listFn,
  listKeys,
  createFn,
  updateFn,
  deleteFn,
  statusFn,
  fields = [],
  columns,
  createLabel = "Create",
  showForm = true,
  allowEdit = true,
  allowDelete = true,
  statusOptions = [],
}) => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(() => emptyValues(fields));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: listFn,
  });

  const allRows = readList(data, listKeys);
  const filteredRows = allRows.filter((row) => matchesSearch(row, search));
  const totalPages = Math.max(Math.ceil(filteredRows.length / pageSize), 1);
  const rows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing ? updateFn(editing._id, payload) : createFn(payload),
    onSuccess: (response) => {
      toast.success(response?.message || `${title} saved successfully`);
      setEditing(null);
      setForm(emptyValues(fields));
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) =>
      toast.error(
        getErrorMessage(error, `Failed to save ${title.toLowerCase()}`),
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: (response) => {
      toast.success(response?.message || `${title} deleted`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) =>
      toast.error(
        getErrorMessage(error, `Failed to delete ${title.toLowerCase()}`),
      ),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => statusFn(id, status),
    onSuccess: (response) => {
      toast.success(response?.message || "Status updated");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Failed to update status")),
  });

  const startEdit = (row) => {
    if (!row) return;
    setEditing(row);
    setForm(
      fields.reduce((values, field) => {
        const raw = field.read ? field.read(row) : row[field.name];
        const value =
          field.type === "date" && raw ? String(raw).slice(0, 10) : raw;
        return { ...values, [field.name]: value ?? field.defaultValue ?? "" };
      }, {}),
    );
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyValues(fields));
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = fields.reduce((values, field) => {
      let value = form[field.name];
      if (field.type === "number" && value !== "") value = Number(value);
      if (field.type === "checkbox") value = Boolean(value);
      if (field.transform) value = field.transform(value);
      return { ...values, [field.name]: value };
    }, {});
    saveMutation.mutate(payload);
  };

  if (isLoading)
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-2xl border border-slate-100 bg-white/60 backdrop-blur-md">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={36} />
          <p className="text-xs font-medium text-slate-500">
            Loading resources...
          </p>
        </div>
      </div>
    );

  if (isError) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-100 bg-rose-50/50 p-8 text-center shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertCircle size={24} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Failed to load {title.toLowerCase()}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {getErrorMessage(error, "Something went wrong while fetching data.")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-2 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={
              isFetching ? "animate-spin text-indigo-600" : "text-slate-400"
            }
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Form Card */}
      {showForm && createFn && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all"
        >
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {editing ? `Edit ${title}` : createLabel}
              </h2>
              <p className="text-xs text-slate-400">
                Fill in the fields below to update management details.
              </p>
            </div>
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <X size={14} />
                Cancel Editing
              </button>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {fields.map((field) => {
              if (field.type === "textarea")
                return (
                  <div
                    key={field.name}
                    className="flex flex-col gap-1.5 xl:col-span-2"
                  >
                    <label className="text-xs font-semibold text-slate-700">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-rose-500">*</span>
                      )}
                    </label>
                    <textarea
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      value={form[field.name]}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                      className="min-h-28 rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                );

              if (field.type === "select")
                return (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-rose-500">*</span>
                      )}
                    </label>
                    <select
                      required={field.required}
                      value={form[field.name]}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <option value="" disabled>
                        Select {field.label}
                      </option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );

              if (field.type === "checkbox")
                return (
                  <div key={field.name} className="flex items-center pt-6">
                    <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={Boolean(form[field.name])}
                        onChange={(e) =>
                          setForm({ ...form, [field.name]: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {field.label}
                    </label>
                  </div>
                );

              if (field.type === "file")
                return (
                  <div
                    key={field.name}
                    className="flex flex-col gap-1.5 xl:col-span-3"
                  >
                    <label className="text-xs font-semibold text-slate-700">
                      {field.label}{" "}
                      {field.required && !editing && (
                        <span className="text-rose-500">*</span>
                      )}
                    </label>
                    <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 transition hover:bg-slate-100/50">
                      <UploadCloud className="mb-2 text-slate-400" size={28} />
                      <p className="text-xs font-medium text-slate-600">
                        Click or drag to upload featured image
                      </p>
                      <p className="text-[11px] text-slate-400">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                      <input
                        required={field.required && !editing}
                        type="file"
                        accept={field.accept}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [field.name]: e.target.files?.[0] || null,
                          })
                        }
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      />
                    </div>
                    {editing && !form[field.name] && field.read?.(editing) && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600">
                        <FileText size={13} />
                        <span>
                          Existing attachment preserved unless overwritten.
                        </span>
                      </div>
                    )}
                  </div>
                );

              return (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {field.label}{" "}
                    {field.required && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    required={field.required}
                    type={field.type || "text"}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={form[field.name]}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {saveMutation.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : editing ? (
                <Save size={16} />
              ) : (
                <Plus size={16} />
              )}
              {editing ? "Save Changes" : createLabel}
            </button>
          </div>
        </form>
      )}

      {/* Main Table View */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  {columns.map((column) => (
                    <th key={column.label} className="px-6 py-3.5">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No records matched your lookup.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row._id}
                      className="transition hover:bg-slate-50/80"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.label}
                          className="px-6 py-4 font-medium text-slate-700"
                        >
                          {column.render(row, formatDate)}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {statusFn &&
                            statusOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                  statusMutation.mutate({
                                    id: row._id,
                                    status: option.value,
                                  })
                                }
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                  option.className ||
                                  "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          {allowEdit && updateFn && (
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => startEdit(row)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                          {allowDelete && deleteFn && (
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => setDeleteTarget(row)}
                              disabled={deleteMutation.isPending}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-6 py-3.5 text-xs text-slate-500">
              <span>
                Page{" "}
                <strong className="font-semibold text-slate-900">{page}</strong>{" "}
                of{" "}
                <strong className="font-semibold text-slate-900">
                  {totalPages}
                </strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminModulePage;
