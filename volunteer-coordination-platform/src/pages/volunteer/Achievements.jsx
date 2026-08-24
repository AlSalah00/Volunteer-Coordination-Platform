import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AchievementStats from "../../components/volunteer/AchievementStats";
import AchievementCard from "../../components/volunteer/AchievementCard";
import { getVolunteerAchievements } from "../../services/achievements";

export default function Achievements() {
  const { volunteerProfile, loadingProfile } = useOutletContext() || {};

  const [achievementsData, setAchievementsData] = useState({
    achievements: [],
    earnedCount: 0,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAchievements() {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await getVolunteerAchievements();

      if (fetchError) {
        setError("Failed to load achievements. Please try refreshing.");
      } else if (data) {
        setAchievementsData(data);
      }
      setLoading(false);
    }

    fetchAchievements();
  }, []);

  return (
    <div className="min-h-screen w-full bg-purple-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-sora text-3xl font-extrabold text-purple-600">
          Achievements
        </h1>
        <p className="mb-8 font-inter text-sm text-purple-600/60">
          Track your milestone progress and badges earned while volunteering.
        </p>

        {/* Top Summary Stat Cards */}
        <AchievementStats
          level={volunteerProfile?.level}
          title={volunteerProfile?.title}
          earnedCount={achievementsData.earnedCount}
          totalCount={achievementsData.totalCount}
          loadingProfile={loadingProfile}
        />

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center font-inter text-sm text-purple-600/60">
            Loading achievements...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-coral-200 bg-coral-50 p-4 text-center font-inter text-sm text-coral-600">
            {error}
          </div>
        )}

        {/* Achievements Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievementsData.achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}