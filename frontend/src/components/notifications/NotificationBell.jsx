import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../api/notification.services";
import NotificationDropdown from "./NotificationDropdown";

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "";

  if (!apiUrl) return window.location.origin;

  return apiUrl.replace(/\/api\/?$/, "");
};

const NotificationBell = ({ className = "" }) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const queryKey = useMemo(() => ["notifications", user?._id], [user?._id]);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getMyNotifications({ limit: 8 }),
    enabled: isAuthenticated && !!user?._id,
    staleTime: 30 * 1000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const patchCache = (updater) => {
    queryClient.setQueryData(queryKey, (current) => {
      if (!current) return current;
      return updater(current);
    });
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (response) => {
      const updated = response?.notification;

      patchCache((current) => {
        const previous = current.notifications.find(
          (item) => item._id === updated?._id,
        );

        return {
          ...current,
          unreadCount:
            previous && !previous.isRead
              ? Math.max((current.unreadCount || 0) - 1, 0)
              : current.unreadCount,
          notifications: current.notifications.map((item) =>
            item._id === updated?._id ? { ...item, ...updated } : item,
          ),
        };
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      patchCache((current) => ({
        ...current,
        unreadCount: 0,
        notifications: current.notifications.map((item) => ({
          ...item,
          isRead: true,
        })),
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, id) => {
      patchCache((current) => {
        const removed = current.notifications.find((item) => item._id === id);

        return {
          ...current,
          unreadCount:
            removed && !removed.isRead
              ? Math.max((current.unreadCount || 0) - 1, 0)
              : current.unreadCount,
          notifications: current.notifications.filter(
            (item) => item._id !== id,
          ),
        };
      });
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return undefined;

    const socket = io(getSocketUrl(), {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.emit("join", user._id);

    if (user.role === "admin") {
      socket.emit("joinAdmin");
    }

    socket.on("notification", (notification) => {
      queryClient.setQueryData(queryKey, (current) => {
        if (!current) {
          return {
            success: true,
            notifications: [notification],
            unreadCount: notification?.isRead ? 0 : 1,
            pagination: { total: 1, page: 1, limit: 8, totalPages: 1 },
          };
        }

        const exists = current.notifications.some(
          (item) => item._id === notification._id,
        );

        return {
          ...current,
          unreadCount: exists
            ? current.unreadCount
            : (current.unreadCount || 0) + (notification?.isRead ? 0 : 1),
          notifications: exists
            ? current.notifications
            : [notification, ...current.notifications].slice(0, 8),
        };
      });

      toast.info(notification?.title || "New notification");
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, queryClient, queryKey, user?._id, user?.role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkRead = (notification) => {
    if (!notification?.isRead) {
      markReadMutation.mutate(notification._id);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={`relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 ${className}`}
        title="Notifications"
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          onMarkRead={handleMarkRead}
          onMarkAllRead={() => markAllReadMutation.mutate()}
          onDelete={(id) => deleteMutation.mutate(id)}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
