import { useState, useEffect } from "react";
import Drawer from "./Drawer";
import {
  Bell,
  CheckCheck,
  ArrowLeft,
  Clock,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";
import { formatDateTime } from "../../utils/activities";
import {
  respondToInvitation,
  getInvitationById,
} from "../../services/invitations";
import Button from "./Button";

export default function NotificationsDrawer() {
  const { notifications, isDrawerOpen, closeDrawer, markAsRead, markAllRead } =
    useNotifications();

  const [selectedNotification, setSelectedNotification] = useState(null);

  const [invitationStatus, setInvitationStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) {
      setSelectedNotification(null);
      setInvitationStatus(null);
    }
  }, [isDrawerOpen]);

  // Fetch invitation status when an activity invitation is selected
  useEffect(() => {
    if (
      selectedNotification?.type === "activity_invitation" &&
      selectedNotification?.data?.invitation_id
    ) {
      setLoadingStatus(true);
      getInvitationById(selectedNotification.data.invitation_id).then(
        ({ data, error }) => {
          setLoadingStatus(false);
          if (!error && data) {
            setInvitationStatus(data.status);
          }
        },
      );
    } else {
      setInvitationStatus(null);
    }
  }, [selectedNotification]);

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
  };

  const handleRespond = async (response) => {
    const invitationId = selectedNotification?.data?.invitation_id;
    if (!invitationId) return;

    setIsResponding(true);
    const { error } = await respondToInvitation(invitationId, response);
    setIsResponding(false);

    if (!error) {
      setInvitationStatus(response);
    }
  };

  const getNotificationType = (notification) => {
    if (!notification) return "Benevolentia";

    switch (notification.type) {
      case "activity_invitation":
        return notification.data?.organizer_name || "Unknown";
      case "system_alert":
      default:
        return "Benevolentia";
    }
  };

  // Helper to filter out ID fields from the jsonb payload
  const getDetailEntries = (data) => {
    if (!data) return [];
    return Object.entries(data).filter(
      ([key]) =>
        key !== "note" &&
        key.toLowerCase() !== "id" &&
        !key.toLowerCase().endsWith("_id") &&
        !key.toLowerCase().endsWith("id"),
    );
  };

  const formatDetailValue = (key, val) => {
  if (val === null || val === undefined) return "";

  const isDateKey = /date|time|_at$/i.test(key);
  const isIsoDateString = typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val);

  if ((isDateKey || isIsoDateString) && !isNaN(Date.parse(val))) {
    const formatted = formatDateTime(val);
    if (formatted && formatted !== "Invalid Date") {
      return formatted;
    }
  }

  return String(val);
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
              {getNotificationType(selectedNotification)}
            </span>
          </div>

          {/* Unified Purple Message Card */}
          <div className="space-y-4 rounded-2xl border border-purple-100 bg-purple-50 p-5 font-inter text-sm leading-relaxed text-purple-600/80">
            {/* Body */}
            <div>{selectedNotification.body}</div>

            {/* Note (if present in JSONB) */}
            {selectedNotification.data?.note && (
              <div className="rounded-xl border border-purple-200/60 bg-white/70 p-3 shadow-2xs">
                <span className="mb-1 block font-sora text-[10px] font-bold uppercase tracking-wider text-purple-600/60">
                  Note
                </span>
                <p className="font-inter text-xs font-medium text-purple-600/80">
                  {selectedNotification.data.note}
                </p>
              </div>
            )}

            {/* Non-ID Key-Value Details */}
            {(() => {
              const details = getDetailEntries(selectedNotification.data);
              if (details.length === 0) return null;

              return (
                <div className="space-y-1.5 border-t border-purple-200/60 pt-3 font-inter text-xs">
                  {details.map(([key, val]) => (
                    <div
                      key={key}
                      className="flex justify-between py-0.5 text-purple-600"
                    >
                      <span className="capitalize text-purple-600/60">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="font-bold">{formatDetailValue(key, val)}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Invitation Action Controls */}
          {selectedNotification.type === "activity_invitation" && (
            <div className="space-y-3 rounded-2xl border border-purple-200/60 bg-white p-4">
              <p className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/60">
                Invitation Action
              </p>

              {loadingStatus ? (
                <div className="flex items-center gap-2 font-inter text-xs text-purple-600/50 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  Checking status...
                </div>
              ) : invitationStatus === "pending" ? (
                <div className="flex items-center gap-3 pt-1">
                  <Button
                    onClick={() => handleRespond("accepted")}
                    disabled={isResponding}
                    variant="primary"
                    className="flex-1 justify-center"
                  >
                    <Check className="h-4 w-4" />
                    {isResponding ? "Processing..." : "Accept"}
                  </Button>
                  <Button
                    onClick={() => handleRespond("declined")}
                    disabled={isResponding}
                    variant="danger"
                    className="flex-1 justify-center"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </Button>
                </div>
              ) : invitationStatus === "accepted" ? (
                <div className="flex items-center gap-2 rounded-xl bg-teal-50 border border-teal-200 p-3 font-inter text-xs font-bold text-teal-700">
                  <Check className="h-4 w-4" />
                  You accepted this invitation.
                </div>
              ) : invitationStatus === "declined" ? (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-coral-200 p-3 font-inter text-xs font-bold text-amber-600">
                  <X className="h-4 w-4" />
                  You declined this invitation.
                </div>
              ) : null}
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
