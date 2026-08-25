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
    <div className="min-h-screen w-full bg-purple-50 flex">
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

      <div className="flex-1 flex pt-20 flex-col min-w-0">
        {!loadingProfile && !isVerified && <VerificationBanner />}

        <main className="flex-1 p-6 lg:p-10">
          <Outlet
            context={{
              organizerProfile,
              isVerified,
              loadingProfile,
              refetchProfile: fetchProfile, // Allows child pages to update layout state
            }}
          />
        </main>
      </div>
    </div>
  );
}
