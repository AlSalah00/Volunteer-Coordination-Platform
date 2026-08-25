// src/components/common/NotificationsDrawer.jsx
import { useState, useEffect } from "react";
import Drawer from "./Drawer";
import { Bell, CheckCheck, ArrowLeft, Clock } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";
import { formatDateTime } from "../../utils/activities";

export default function NotificationsDrawer() {
  const { notifications, isDrawerOpen, closeDrawer, markAsRead, markAllRead } =
    useNotifications();

  // Local state for detail view
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Reset detail view when drawer closes
  useEffect(() => {
    if (!isDrawerOpen) {
      setSelectedNotification(null);
    }
  }, [isDrawerOpen]);

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
  };

  const getNotificationType = (type) => {
    switch (type) {
      case "system_alert":
        return "Benevolentia";
      default:
        return "Benevolentia";
    }
  };

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title={
        selectedNotification ? (
          <button
            type="button"
            onClick={() => setSelectedNotification(null)}
            className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notifications
          </button>
        ) : (
          "Notifications"
        )
      }
    >
      {/* Detail View */}
      {selectedNotification ? (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="font-sora text-base font-extrabold text-purple-600">
                {selectedNotification.title}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 font-inter text-xs text-purple-600/50">
                <Clock className="h-3.5 w-3.5" />
                {formatDateTime(selectedNotification.created_at)}
              </p>
            </div>
          </div>

          <div className="font-inter text-xs font-semibold text-purple-600/70">
            From:{" "}
            <span className="font-bold text-purple-600">
              {getNotificationType(selectedNotification.type)}
            </span>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5 font-inter text-sm leading-relaxed text-purple-600/80">
            {selectedNotification.body}
          </div>

          {selectedNotification.data &&
            Object.keys(selectedNotification.data).length > 0 && (
              <div className="space-y-2 rounded-2xl border border-purple-200/60 bg-white p-4">
                <p className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50">
                  Additional Details
                </p>
                <div className="space-y-1 font-inter text-xs text-purple-600">
                  {Object.entries(selectedNotification.data).map(
                    ([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between py-1 border-b border-purple-50 last:border-none"
                      >
                        <span className="capitalize text-purple-600/60">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="font-bold">{String(val)}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50">
              Recent Alerts
            </span>
            {notifications.some((n) => !n.read_at) && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 font-sora text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <Bell className="h-6 w-6" />
              </div>
              <p className="mt-3 font-sora text-sm font-bold text-purple-600">
                No notifications yet
              </p>
              <p className="mt-1 font-inter text-xs text-purple-600/50">
                We will update you when actions occur.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectNotification(item)}
                  className={`group flex items-start gap-3.5 rounded-2xl border p-4 transition-all cursor-pointer ${
                    !item.read_at
                      ? "border-purple-200 bg-white shadow-xs hover:border-purple-300 hover:shadow-md"
                      : "border-purple-100 bg-purple-50/30 opacity-75 hover:bg-white"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="truncate font-sora text-xs font-extrabold text-purple-600">
                        {item.title}
                      </h4>
                      {!item.read_at && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-purple-600" />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 font-inter text-xs text-purple-600/70">
                      {item.body}
                    </p>
                    <span className="mt-2 block font-inter text-[10px] text-purple-600/40">
                      {formatDateTime(item.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
