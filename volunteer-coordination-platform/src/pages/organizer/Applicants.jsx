import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ApplicantCard from "../../components/applicants/ApplicantCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  getActivityApplicants,
  updateApplicationStatus,
} from "../../services/applications";
import { getActivityName } from "../../services/activities";
import { useToast } from "../../contexts/ToastContext";
import VolProfileDrawer from "../../components/volunteer/VolProfileDrawer";

const MODAL_COPY = {
  accept: {
    variant: "default",
    title: "Add this volunteer to the team?",
    description: "They'll be notified and added to this activity's team.",
    confirmLabel: "Add To The Team",
    nextStatus: "approved",
  },
  reject: {
    variant: "danger",
    title: "Pass on this volunteer?",
    description: "They'll be notified this activity isn't currently a fit.",
    confirmLabel: "Pass",
    nextStatus: "rejected",
  },
  revoke: {
    variant: "danger",
    title: "Remove from the team?",
    description:
      "They'll lose their spot in this activity and move back to pending review.",
    confirmLabel: "Remove",
    nextStatus: "submitted",
  },
  reconsider: {
    variant: "default",
    title: "Reconsider this volunteer?",
    description:
      "They'll move back to pending review, and you can decide again later.",
    confirmLabel: "Reconsider",
    nextStatus: "submitted",
  },
};

function StatBlock({ label, value }) {
  return (
    <div className="rounded-xl border border-purple-200/60 bg-white p-4 text-center">
      <p className="font-sora text-2xl font-extrabold text-purple-600">
        {value}
      </p>
      <p className="font-inter text-xs text-purple-600/60">{label}</p>
    </div>
  );
}

export default function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [activityName, setActivityName] = useState(
    location.state?.activityName ?? null,
  );
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // { type: "accept" | "reject" | "revoke" | "reconsider", applicant } or null
  const [confirmAction, setConfirmAction] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getActivityApplicants(id).then(({ data, error: fetchError }) => {
      if (!isMounted) return;
      if (fetchError) {
        setError("Couldn't load applicants.");
      } else {
        setApplicants(data);
      }
      setLoading(false);
    });

    // this only hit the network for the name if it wasn't handed to us.
    // covers a page refresh, where state is gone. I want to display the name in the heading, that's why.
    if (!activityName) {
      getActivityName(id).then(({ data }) => {
        if (isMounted && data) setActivityName(data.name);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleConfirm = async () => {
    if (!confirmAction) return;

    const { nextStatus } = MODAL_COPY[confirmAction.type];

    setIsUpdating(true);
    const { error: updateError } = await updateApplicationStatus(
      confirmAction.applicant.id,
      nextStatus,
    );
    setIsUpdating(false);
    setConfirmAction(null);

    if (updateError) {
      showToast({
        type: "error",
        message: "Couldn't update your decision. Please try again.",
      });
      return;
    }

    setApplicants((prev) =>
      prev.map((a) =>
        a.id === confirmAction.applicant.id ? { ...a, status: nextStatus } : a,
      ),
    );
    showToast({ type: "success", message: "Decision updated." });
  };

  const copy = confirmAction ? MODAL_COPY[confirmAction.type] : null;

  const counts = {
    total: applicants.length,
    pending: applicants.filter((a) => a.status === "submitted").length,
    approved: applicants.filter((a) => a.status === "approved").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="max-w-3xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 font-sora text-sm font-bold text-purple-600 hover:underline cursor-pointer"
      >
        ← Back
      </button>

      <h1 className="mb-6 font-sora text-3xl font-extrabold text-purple-600">
        Volunteers Waiting{activityName ? ` - ${activityName}` : ""}
      </h1>

      {!loading && !error && applicants.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBlock label="Want to volunteer" value={counts.total} />
          <StatBlock label="Awaiting" value={counts.pending} />
          <StatBlock label="Added to the team" value={counts.approved} />
          <StatBlock label="Not Selected" value={counts.rejected} />
        </div>
      )}

      {loading && (
        <p className="font-inter text-sm text-purple-600/60">
          Loading volunteers...
        </p>
      )}

      {error && (
        <div className="mb-6 rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
          {error}
        </div>
      )}

      {!loading && !error && applicants.length === 0 && (
        <p className="font-inter text-sm text-purple-600/60">
          No one has requested to volunteer in this activity yet.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {applicants.map((applicant) => (
          <ApplicantCard
            key={applicant.id}
            applicant={applicant}
            onSelectProfile={setSelectedApplicant}
            onAccept={(a) => setConfirmAction({ type: "accept", applicant: a })}
            onReject={(a) => setConfirmAction({ type: "reject", applicant: a })}
            onRevoke={(a) => setConfirmAction({ type: "revoke", applicant: a })}
            onReconsider={(a) =>
              setConfirmAction({ type: "reconsider", applicant: a })
            }
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={confirmAction !== null}
        variant={copy?.variant}
        title={copy?.title}
        description={copy?.description}
        confirmLabel={copy?.confirmLabel}
        isLoading={isUpdating}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <VolProfileDrawer
        isOpen={Boolean(selectedApplicant)}
        onClose={() => setSelectedApplicant(null)}
        applicant={selectedApplicant}
      />
    </div>
  );
}
