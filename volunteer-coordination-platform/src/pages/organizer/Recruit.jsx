import { useState, useEffect } from "react";
import { Search, UserPlus, Users, Send, Clock, CheckCircle2, XCircle } from "lucide-react";
import Avatar from "../../components/common/Avatar";
import VolProfileDrawer from "../../components/volunteer/VolProfileDrawer";
import InviteModal from "../../components/organizer/InviteModal";
import { getAllVolunteers } from "../../services/profile";
import { getOrganizerSentInvitations } from "../../services/invitations";
import Button from "../../components/common/Button";

export default function Recruit() {
  const [activeTab, setActiveTab] = useState("directory");
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedVolunteerForDrawer, setSelectedVolunteerForDrawer] =
    useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedVolunteerForInvite, setSelectedVolunteerForInvite] =
    useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [invitations, setInvitations] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);

  const fetchVolunteers = async () => {
    setLoading(true);
    const { data } = await getAllVolunteers();
    setVolunteers(data);
    setLoading(false);
  };

  const fetchInvitations = async () => {
    setLoadingInvitations(true);
    const { data } = await getOrganizerSentInvitations();
    setInvitations(data);
    setLoadingInvitations(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  useEffect(() => {
    if (activeTab === "invitations") {
      fetchInvitations();
    }
  }, [activeTab]);

  const filteredVolunteers = volunteers.filter((vol) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      vol.fullName.toLowerCase().includes(q) ||
      (vol.email && vol.email.toLowerCase().includes(q))
    );
  });

  const handleOpenDrawer = (vol) => {
    setSelectedVolunteerForDrawer(vol);
    setIsDrawerOpen(true);
  };

  const handleOpenInvite = (e, vol) => {
    e.stopPropagation();
    setSelectedVolunteerForInvite(vol);
    setIsInviteModalOpen(true);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 font-sora text-[11px] font-bold text-teal-700 border border-teal-200/60">
            <CheckCircle2 className="h-3 w-3" />
            Accepted
          </span>
        );
      case "declined":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-sora text-[11px] font-bold text-rose-700 border border-rose-200/60">
            <XCircle className="h-3 w-3" />
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-sora text-[11px] font-bold text-amber-700 border border-amber-200/60">
            <Clock className="h-3 w-3" />
            Awaiting Volunteer
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sora text-2xl font-extrabold text-purple-600">
            Recruit Talent
          </h1>
          <p className="mt-1 font-inter text-xs text-purple-600/60">
            Browse active volunteers and send direct invitations to join your
            activities.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-white p-1 shadow-xs border border-purple-200/60">
          <button
            type="button"
            onClick={() => setActiveTab("directory")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-sora text-xs font-bold transition-all cursor-pointer ${
              activeTab === "directory"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-purple-600/70 hover:text-purple-600"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Volunteer Directory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invitations")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-sora text-xs font-bold transition-all cursor-pointer ${
              activeTab === "invitations"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-purple-600/70 hover:text-purple-600"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            Invitations
          </button>
        </div>
      </div>

      {/* Directory Tab View */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by volunteer name or email..."
              className="w-full rounded-2xl border border-purple-200/60 bg-white py-2.5 pl-10 pr-4 font-inter text-xs text-purple-900 placeholder-purple-600/40 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            />
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="py-20 text-center font-inter text-xs font-semibold text-purple-600/60">
              Loading directory...
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-purple-200/80 bg-white p-12 text-center">
              <Users className="h-10 w-10 text-purple-600/30" />
              <p className="mt-3 font-sora text-sm font-bold text-purple-600">
                No volunteers found
              </p>
              <p className="mt-1 font-inter text-xs text-purple-600/50">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "No registered volunteers yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVolunteers.map((vol) => (
                <div
                  key={vol.profile_id}
                  onClick={() => handleOpenDrawer(vol)}
                  className="group flex flex-col justify-between rounded-2xl border border-purple-200/60 bg-white p-5 transition-all hover:border-purple-300 hover:shadow-md cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* User Info Header */}
                    <div className="flex items-start gap-3.5">
                      <Avatar
                        src={vol.volunteerAvatarUrl}
                        name={vol.fullName}
                        size={48}
                        className="border border-purple-100"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-sora text-sm font-extrabold text-purple-600">
                          {vol.fullName}
                        </h3>

                        <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5">
                          <span className="font-sora text-[11px] font-bold text-purple-600">
                            Lvl {vol.level ?? 1} • {vol.title ?? "Volunteer"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio / Skills preview */}
                    {vol.bio && (
                      <p className="line-clamp-2 font-inter text-xs leading-relaxed text-purple-600/70">
                        {vol.bio}
                      </p>
                    )}

                    {vol.skills && vol.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {vol.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-block rounded-md bg-purple-50/80 px-2 py-0.5 font-sora text-[10px] font-semibold text-purple-600"
                          >
                            {skill}
                          </span>
                        ))}
                        {vol.skills.length > 3 && (
                          <span className="inline-block font-sora text-[10px] font-semibold text-purple-600/50">
                            +{vol.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 border-t border-purple-50 pt-4 flex justify-end">
                    <Button
                      onClick={(e) => handleOpenInvite(e, vol)}
                      variant="primary"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Invite
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invitations Tab View */}
      {activeTab === "invitations" && (
        <div className="space-y-6">
          {loadingInvitations ? (
            <div className="py-20 text-center font-inter text-xs font-semibold text-purple-600/60">
              Loading sent invitations...
            </div>
          ) : invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-purple-200/80 bg-white p-12 text-center">
              <Send className="h-10 w-10 text-purple-600/30" />
              <p className="mt-3 font-sora text-sm font-bold text-purple-600">
                No invitations sent yet
              </p>
              <p className="mt-1 font-inter text-xs text-purple-600/50">
                Go to the Volunteer Directory tab to invite talent to your
                activities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-col justify-between rounded-2xl border border-purple-200/60 bg-white p-5 transition-all hover:border-purple-300 shadow-xs"
                >
                  <div className="space-y-4">
                    {/* Volunteer Info Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          src={inv.volunteerAvatarUrl}
                          name={inv.volunteerName}
                          size={44}
                          className="border border-purple-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="truncate font-sora text-sm font-extrabold text-purple-600">
                            {inv.volunteerName}
                          </h3>
                          <p className="font-inter text-[11px] text-purple-600/50">
                            Sent{" "}
                            {new Date(inv.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {renderStatusBadge(inv.status)}
                    </div>

                    {/* Activity & Task Context */}
                    <div className="rounded-xl bg-purple-50/50 p-3 border border-purple-100/60 space-y-1">
                      <p className="font-sora text-xs font-extrabold text-purple-600 truncate">
                        {inv.activityTitle}
                      </p>
                      <p className="font-inter text-[11px] font-semibold text-purple-600/60 truncate">
                        Task:{" "}
                        <span className="text-purple-600">{inv.taskName}</span>
                      </p>
                    </div>

                    {/* Optional Note */}
                    {inv.note && (
                      <p className="line-clamp-2 font-inter text-xs italic text-purple-600/80 bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                        "{inv.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Drawer */}
      <VolProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        volunteerId={selectedVolunteerForDrawer?.profile_id}
      />

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        volunteer={selectedVolunteerForInvite}
        onSuccess={() => {
          // Toast or feedback after successful invitation
        }}
      />
    </div>
  );
}
