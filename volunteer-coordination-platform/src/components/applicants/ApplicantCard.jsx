import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import ApplicantStatusBadge from "./ApplicantStatusBadge";
import MatchBadge from "./MatchBadge";

export default function ApplicantCard({ applicant, onSelectProfile, onAccept, onReject, onRevoke, onReconsider }) {
  return (
    <div className="rounded-2xl border border-purple-200/60 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onSelectProfile(applicant)}
          className="-ml-1 flex cursor-pointer items-center gap-3 rounded-full py-1 pr-3 transition-colors hover:bg-purple-50 text-left"
        >
          <Avatar src={applicant.volunteerAvatarUrl} name={applicant.volunteerName} size={44} />
          <span className="font-sora text-sm font-bold text-purple-600">{applicant.volunteerName}</span>
        </button>

        <ApplicantStatusBadge status={applicant.status} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/40 px-4 py-3">
          <span className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600">
            Picked Task
          </span>
          <span className="font-inter text-sm font-semibold text-purple-600/50">
            {applicant.taskName}
          </span>
        </div>

        {(applicant.organizerReasoning || applicant.matchResult) && (
          <div className="rounded-xl border border-purple-200/70 bg-purple-50/80 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-sora text-xs font-bold uppercase tracking-wider text-purple-600">
                <Sparkles className="h-3.5 w-3.5" />
                AI Note
              </div>
              <MatchBadge matchResult={applicant.matchResult} />
            </div>

            {applicant.organizerReasoning && (
              <p className="font-inter text-sm leading-relaxed text-purple-600/50">
                {applicant.organizerReasoning}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-purple-200/60 pt-4 flex justify-end gap-3">
        {applicant.status === "submitted" && (
          <>
            <Button variant="danger" onClick={() => onReject(applicant)}>
              Not This Time
            </Button>
            <Button variant="primary" onClick={() => onAccept(applicant)}>
              Add To Team
            </Button>
          </>
        )}
        {applicant.status === "approved" && (
          <Button variant="danger" onClick={() => onRevoke(applicant)}>
            Remove From Team
          </Button>
        )}
        {applicant.status === "rejected" && (
          <Button variant="secondary" onClick={() => onReconsider(applicant)}>
            Reconsider
          </Button>
        )}
      </div>
    </div>
  );
}