import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Loader2, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
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
      toast.success(response?.message || `${title} saved`);
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
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (isError) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load {title.toLowerCase()}
        </h2>
        <p className="mt-2 text-gray-500">
          {getErrorMessage(error, "Something went wrong")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {showForm && createFn && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              {editing ? `Edit ${title}` : createLabel}
            </h2>
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fields.map((field) => {
              if (field.type === "textarea")
                return (
                  <textarea
                    key={field.name}
                    required={field.required}
                    placeholder={field.label}
                    value={form[field.name]}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    className="min-h-28 rounded-lg border px-3 py-2 xl:col-span-2"
                  />
                );
              if (field.type === "select")
                return (
                  <select
                    key={field.name}
                    required={field.required}
                    value={form[field.name]}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2"
                  >
                    <option value="">{field.label}</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                );
              if (field.type === "checkbox")
                return (
                  <label
                    key={field.name}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.name])}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.checked })
                      }
                    />
                    {field.label}
                  </label>
                );
              return (
                <input
                  key={field.name}
                  required={field.required}
                  type={field.type || "text"}
                  placeholder={field.label}
                  value={form[field.name]}
                  onChange={(e) =>
                    setForm({ ...form, [field.name]: e.target.value })
                  }
                  className="rounded-lg border px-3 py-2"
                />
              );
            })}
          </div>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {editing ? <Save size={17} /> : <Plus size={17} />}
            {editing ? "Save Changes" : createLabel}
          </button>
        </form>
      )}

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-4xl">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.label}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={column.label}
                        className="px-6 py-4 text-sm text-gray-700"
                      >
                        {column.render(row, formatDate)}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
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
                              className={`rounded-lg px-3 py-2 text-xs font-semibold ${option.className || "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        {allowEdit && updateFn && (
                          <button
                            type="button"
                            title="Edit"
                            onClick={() => startEdit(row)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit3 size={17} />
                          </button>
                        )}
                        {allowDelete && deleteFn && (
                          <button
                            type="button"
                            title="Delete"
                            onClick={() => setDeleteTarget(row)}
                            disabled={deleteMutation.isPending}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={17} />
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
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 text-sm text-gray-500 shadow-sm">
          <span>
            Page <strong className="text-gray-800">{page}</strong> of{" "}
            <strong className="text-gray-800">{totalPages}</strong>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-lg border px-3 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-lg border px-3 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete record"
        message="Delete this record? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminModulePage;
