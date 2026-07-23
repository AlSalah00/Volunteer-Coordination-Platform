import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";

export default function VolunteerHomepage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await getCurrentUser();
      setUser(data?.user);
    }

    loadUser();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-purple-300">
      <h1 className="font-sora text-4xl font-bold text-purple-600">
        Welcome {user?.email}
      </h1>
    </main>
  );
}