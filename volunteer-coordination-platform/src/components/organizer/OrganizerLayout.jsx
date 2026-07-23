import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import VerificationBanner from "./VerificationBanner";
import { getOrganizerProfile } from "../../services/profile_org";

export default function OrganizerLayout() {
  const [organizerProfile, setOrganizerProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getOrganizerProfile().then(({ data }) => {
      if (isMounted) {
        setOrganizerProfile(data ?? null);
        setLoadingProfile(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const isVerified = organizerProfile?.verification_status === "verified";

  return (
    <div className="min-h-screen w-full bg-purple-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {!loadingProfile && !isVerified && <VerificationBanner />}

        <main className="flex-1 p-6 lg:p-10">
          <Outlet context={{ organizerProfile, isVerified }} />
        </main>
      </div>
    </div>
  );
}
