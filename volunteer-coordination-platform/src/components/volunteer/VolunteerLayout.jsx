import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { signOut } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { getVolunteerProfile } from "../../services/profile";
import { Compass, Calendar, Bookmark, Award } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";

const volunteerNavItems = [
  { to: "/volunteer/explore", label: "Explore", icon: Compass },
  { to: "/volunteer/my-activities", label: "My Activities", icon: Calendar },
  { to: "/volunteer/bookmarks", label: "Bookmarks", icon: Bookmark },
  { to: "/volunteer/achievements", label: "Achievements", icon: Award },
];

export default function VolunteerLayout() {
  const [volunteerProfile, setVolunteerProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { unreadCount, openDrawer } = useNotifications();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const { data } = await getVolunteerProfile();
    setVolunteerProfile(data ?? null);
    setLoadingProfile(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fullName =
    [volunteerProfile?.first_name, volunteerProfile?.last_name]
      .filter(Boolean)
      .join(" ") || "Unknown Volunteer";

  return (
    <div className="min-h-screen w-full bg-purple-50 flex flex-col md:flex-row">
      <Sidebar
        navItems={volunteerNavItems}
        profileName={fullName}
        avatarUrl={volunteerProfile?.avatar_url}
        profileSubtext="Volunteer Profile"
        profileLink="/volunteer/profile"
        unreadNotificationCount={unreadCount}
        onOpenNotifications={openDrawer}
        onLogout={async () => {
          await signOut();
          navigate("/");
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-10"> 
          <Outlet
            context={{
              volunteerProfile,
              loadingProfile,
              refetchProfile: fetchProfile,
            }}
          />
        </main>
      </div>
    </div>
  );
}
