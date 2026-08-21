import { CheckCheck, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const NotificationDropdown = ({
  notifications = [],
  unreadCount = 0,
  isLoading = false,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClose,
}) => {
  return (
    <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Notifications</p>
          <p className="text-xs text-slate-500">{unreadCount} unread</p>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={!unreadCount}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          <CheckCheck size={14} />
          Read all
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`group border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                notification.isRead ? "bg-white" : "bg-blue-50/60"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    notification.isRead ? "bg-slate-300" : "bg-blue-600"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => onMarkRead(notification)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {notification.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-[11px] font-medium uppercase text-slate-400">
                    {notification.type} | {formatTime(notification.createdAt)}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(notification._id)}
                  className="rounded-md p-1.5 text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100"
                  title="Delete notification"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            No notifications yet.
          </div>
        )}
      </div>

      <Link
        to="/notifications"
        onClick={onClose}
        className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-slate-50"
      >
        View all notifications
      </Link>
    </div>
  );
};

export default NotificationDropdown;
