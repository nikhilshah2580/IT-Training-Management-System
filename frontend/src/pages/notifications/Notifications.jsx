import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

import {
  deleteAllNotifications,
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../api/notification.services";
import { showError, showSuccess } from "../../utils/toast";

const formatDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const Notifications = () => {
  const queryClient = useQueryClient();
  const queryKey = ["notifications-page"];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getMyNotifications({ limit: 100 }),
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const invalidateNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey });
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: invalidateNotifications,
    onError: (error) => showError(error, "Failed to mark notification as read"),
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      showSuccess("All notifications marked as read");
      invalidateNotifications();
    },
    onError: (error) =>
      showError(error, "Failed to mark notifications as read"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: invalidateNotifications,
    onError: (error) => showError(error, "Failed to delete notification"),
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      showSuccess("All notifications deleted");
      invalidateNotifications();
    },
    onError: (error) => showError(error, "Failed to delete notifications"),
  });

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => markAllReadMutation.mutate()}
            disabled={!unreadCount}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>

          <button
            type="button"
            onClick={() => deleteAllMutation.mutate()}
            disabled={!notifications.length}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
          >
            <Trash2 size={16} />
            Delete all
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length ? (
          notifications.map((notification) => (
            <article
              key={notification._id}
              className={`border-b border-slate-100 p-4 last:border-b-0 sm:p-5 ${
                notification.isRead ? "bg-white" : "bg-blue-50/60"
              }`}
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Bell size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        {notification.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {notification.message}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs font-medium text-slate-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                      {notification.type}
                    </span>

                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          markReadMutation.mutate(notification._id)
                        }
                        className="rounded-md px-2.5 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        Mark read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(notification._id)}
                      className="rounded-md px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Bell size={22} />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">
              No notifications yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Notifications;
