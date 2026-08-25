import { useState, useEffect } from "react";
import { Search, UserPlus, Users, Send } from "lucide-react";
import Avatar from "../../components/common/Avatar";
import VolProfileDrawer from "../../components/volunteer/VolProfileDrawer";
import InviteModal from "../../components/organizer/InviteModal";
import { getAllVolunteers } from "../../services/profile";
import Button from "../../components/common/Button";

export default function Recruit() {
  const [activeTab, setActiveTab] = useState("directory");
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedVolunteerForDrawer, setSelectedVolunteerForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedVolunteerForInvite, setSelectedVolunteerForInvite] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchVolunteers = async () => {
    setLoading(true);
    const { data } = await getAllVolunteers();
    setVolunteers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sora text-2xl font-extrabold text-purple-600">
            Recruit Talent
          </h1>
          <p className="mt-1 font-inter text-xs text-purple-600/60">
            Browse active volunteers and send direct invitations to join your activities.
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
                {searchQuery ? "Try adjusting your search terms." : "No registered volunteers yet."}
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

      {/* Invitations Tab View (Placeholder for next step) */}
      {activeTab === "invitations" && (
        <div className="rounded-3xl border border-purple-200/60 bg-white p-12 text-center font-inter text-xs text-purple-600/60">
          Sent Invitations list will be implemented here next!
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