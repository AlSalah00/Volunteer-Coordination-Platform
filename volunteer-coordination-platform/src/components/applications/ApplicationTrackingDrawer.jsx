import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ClipboardList, Sparkles, Info } from "lucide-react";
import Drawer from "../common/Drawer";
import ConfirmModal from "../common/ConfirmModal";
import QrScannerModal from "../common/QRScannerModal";
import { getApplicationDetails } from "../../services/applications";
import { getApplicationState } from "../../utils/applicationState";
import { formatDateTime } from "../../utils/activities";
import { useToast } from "../../contexts/ToastContext";
import Button from "../common/Button";

export default function ApplicationTrackingDrawer({
  applicationId,
  isOpen,
  onClose,
  onWithdrawn,
}) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (!isOpen || !applicationId) {
      setDetails(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError("");

    getApplicationDetails(applicationId).then(({ data, error: fetchError }) => {
      if (!isMounted) return;
      if (fetchError || !data) {
        setError("Couldn't load this application.");
      } else {
        setDetails(data);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, applicationId]);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    const { error: withdrawError } = await withdrawApplication(applicationId);
    setIsWithdrawing(false);
    setShowWithdrawConfirm(false);

    if (withdrawError) {
      showToast({
        type: "error",
        message:
          "Oh no! We couldn't withdraw your request to volunteer. Please try again.",
      });
      return;
    }

    showToast({ type: "success", message: "Request to volunteer withdrawn." });
    onWithdrawn?.(applicationId);
    onClose();
  };

  const state = details
    ? getApplicationState({
        applicationStatus: details.status,
        activityStatus: details.activities?.status,
        checkInStatus: details.checked_in_at,
      })
    : null;

  const handleScanSuccess = (scannedCode) => {
    setShowScanner(false);
    console.log("Scanned QR Code payload:", scannedCode);

    showToast({
      type: "success",
      message: "QR code scanned! (Check-in pending database implementation)",
    });
  };

  const handleActionClick = () => {
    if (!state?.action) return;

    switch (state.action.type) {
      case "WITHDRAW_APPLICATION":
        setShowWithdrawConfirm(true);
        break;

      case "NAVIGATE_EXPLORE":
        onClose();
        navigate("/volunteer/explore");
        break;

      case "CHECK_IN":
        onClose();
        setShowScanner(true);
        break;

      case "NAVIGATE_BACK":
        onClose();
        break;

      default:
        console.warn(`Unhandled action type: ${state.action.type}`);
    }
  };

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} title="Activity State">
        {loading && (
          <p className="font-inter text-sm text-purple-600/60">Loading...</p>
        )}

        {error && (
          <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
            {error}
          </div>
        )}

        {details && state && (
          <div className="flex flex-col gap-6">
            {/* Activity name + when they applied */}
            <div>
              <h3 className="mb-1.5 font-sora text-xl font-extrabold text-purple-600">
                {details.activities?.name}
              </h3>
              <div className="flex items-center gap-1.5 font-inter text-xs text-purple-600/50">
                <Calendar className="h-3.5 w-3.5" />
                Request sent {formatDateTime(details.created_at)}
              </div>
            </div>

            {/* Status */}
            <div className="rounded-xl border border-purple-200/60 bg-purple-50/50 p-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-sora text-xs font-bold uppercase tracking-wide text-purple-600/50">
                  Status
                </p>

                {/* Check-In Badge */}
                {state.showCompletion && (
                <span
                  className={`rounded-full px-2.5 py-0.5 font-sora text-[11px] font-bold border ${
                    details.checked_in_at
                      ? "border-teal-200/60 bg-teal-50 text-teal-700"
                      : "border-amber-200/60 bg-amber-50 text-amber-800"
                  }`}
                >
                  {details.checked_in_at ? "Checked-In" : "Not Checked-In"}
                </span>
                )}
              </div>

              <p className="mb-3 font-sora text-base font-extrabold text-purple-600">
                {state.label}
              </p>
              <p className="font-inter text-sm leading-relaxed text-purple-600/80">
                {state.state}
              </p>
            </div>

            {/* What's next */}
            <div className="flex gap-3 rounded-xl border border-purple-200/60 bg-purple-50/50 p-4">
              <Info className="h-4 w-4 shrink-0 text-purple-600/50" />
              <div>
                <p className="mb-1 font-sora text-xs font-bold tracking-wide text-purple-600/50">
                  What's next
                </p>
                <p className="font-inter text-sm leading-relaxed text-purple-600/80">
                  {state.whatsNext}
                </p>
              </div>
            </div>

            {/* AI feedback. Only while it's still relevant */}
            {state.showAiFeedback && details.volunteerFeedback && (
              <div className="flex gap-3 rounded-xl border border-purple-200/60 bg-purple-50/50 p-4">
                <Sparkles className="h-4 w-4 shrink-0 text-purple-600/50" />
                <div>
                  <p className="mb-1 font-sora text-xs font-bold tracking-wide text-purple-600/50">
                    A note from our AI helper
                  </p>
                  <p className="font-inter text-sm leading-relaxed text-purple-600/80">
                    {details.volunteerFeedback}
                  </p>
                </div>
              </div>
            )}

            {/* Picked task */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 font-sora text-xs font-bold tracking-wide text-purple-600/50">
                  <ClipboardList className="h-3.5 w-3.5" />
                  Your Task
                </p>

                {/* Task Completion Badge */}
                {state.showCompletion && (
                <span
                  className={`rounded-full px-2.5 py-0.5 font-sora text-[11px] font-bold border ${
                    details.task_completed_at
                      ? "border-teal-200/60 bg-teal-50 text-teal-700"
                      : "border-amber-200/60 bg-amber-50 text-amber-800"
                  }`}
                >
                  {details.task_completed_at ? "Completed" : "Incomplete"}
                </span>
                )}
              </div>

              <div className="rounded-xl border border-purple-200/60 p-4">
                <p className="mb-1 font-sora text-sm font-bold text-purple-600">
                  {details.activity_tasks?.name}
                </p>
                {details.activity_tasks?.description && (
                  <p className="font-inter text-xs leading-relaxed text-purple-600/60">
                    {details.activity_tasks.description}
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Action Button */}
            {state.action && (
              <div className="mt-4 pt-4 border-t border-purple-100">
                <Button
                  variant={state.action.variant}
                  disabled={state.action.disabled}
                  onClick={handleActionClick}
                  className="w-full"
                >
                  {state.action.label}
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmModal
        isOpen={showWithdrawConfirm}
        variant="danger"
        title="Withdraw this volunteering request?"
        description="You can't undo this. If you change your mind, you'll need to apply again."
        confirmLabel="Withdraw"
        isLoading={isWithdrawing}
        onConfirm={handleWithdraw}
        onCancel={() => setShowWithdrawConfirm(false)}
      />

      <QrScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScanSuccess}
      />
    </>
  );
}
