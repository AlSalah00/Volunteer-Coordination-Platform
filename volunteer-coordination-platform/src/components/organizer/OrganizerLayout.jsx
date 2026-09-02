import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import VerificationBanner from "./VerificationBanner";
import { useNotifications } from "../../contexts/NotificationContext";
import { signOut } from "../../services/auth";
import { getOrganizerProfile } from "../../services/profile";
import { LayoutDashboard, Sparkles, UserPlus, Star } from "lucide-react";

const organizerNavItems = [
  { to: "/organizer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/organizer/activities", label: "Activities", icon: Sparkles },
  { to: "/organizer/recruit", label: "Recruit", icon: UserPlus },
  { to: "/organizer/reviews", label: "Reviews", icon: Star },
];

export default function OrganizerLayout() {
  const [organizerProfile, setOrganizerProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { unreadCount, openDrawer } = useNotifications();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const { data } = await getOrganizerProfile();
    setOrganizerProfile(data ?? null);
    setLoadingProfile(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const isVerified = organizerProfile?.verification_status === "verified";

  return (
    <div className="min-h-screen w-full bg-purple-50 flex flex-col md:flex-row">
      <Sidebar
        navItems={organizerNavItems}
        profileName={organizerProfile?.org_name || "Unknown Organizer"}
        avatarUrl={organizerProfile?.avatar_url}
        profileSubtext="Organizer Profile"
        profileLink="/organizer/profile"
        unreadNotificationCount={unreadCount}
        onOpenNotifications={openDrawer}
        onLogout={async () => {
          await signOut();
          navigate("/");
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        {/* Banner wrapper aligned with main content margins */}
        {!loadingProfile && !isVerified && (
          <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8">
            <VerificationBanner />
          </div>
        )}

        {/* Adjust top padding when banner exists using standard document flow */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-10 ${!isVerified && !loadingProfile ? "pt-4 sm:pt-6" : ""}`}>
          <Outlet
            context={{
              organizerProfile,
              isVerified,
              loadingProfile,
              refetchProfile: fetchProfile,
            }}
          />
        </main>
      </div>
    </div>
  );
}