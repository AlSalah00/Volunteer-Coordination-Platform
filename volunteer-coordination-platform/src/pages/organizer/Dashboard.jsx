import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Heart,
  Sparkles,
  HandHeart,
  Users,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { getOrganizerDashboardMetrics, getOrganizerUpcomingActivities } from "../../services/dashboard";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function Dashboard() {
  const { organizerProfile } = useOutletContext() || {};

  const [metrics, setMetrics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    let isMounted = true;

    Promise.all([getOrganizerDashboardMetrics(), getOrganizerUpcomingActivities()]).then(
      ([{ data: metricsData, error: metricsError }, { data: activitiesData, error: activitiesError }]) => {
        if (!isMounted) return;

        if (metricsError || activitiesError) {
          setError("Couldn't load your dashboard. Try refreshing.");
        } else {
          setMetrics(metricsData);
          setActivities(activitiesData);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const minMonth = startOfMonth(new Date());
  const maxMonth = startOfMonth(new Date(minMonth.getFullYear(), minMonth.getMonth() + 3, 1));
  const canGoPrev = visibleMonth.getTime() > minMonth.getTime();
  const canGoNext = visibleMonth.getTime() < maxMonth.getTime();

  const goToPrevMonth = () => {
    if (!canGoPrev) return;
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    if (!canGoNext) return;
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = new Date(year, month, 1).getDay();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const activitiesByDay = activities.reduce((acc, activity) => {
    const start = new Date(activity.starts_at);
    if (start.getFullYear() !== year || start.getMonth() !== month) return acc;
    const day = start.getDate();
    (acc[day] ??= []).push(activity);
    return acc;
  }, {});

  const metricCards = [
    {
      title: "Hours Gifted",
      value: metrics ? `${Math.round(metrics.hours_gifted).toLocaleString()} hrs` : "-",
      subtext: "Scheduled time contributed",
      icon: Heart,
    },
    {
      title: "Activities Shared",
      value: metrics ? metrics.activities_shared.toLocaleString() : "-",
      subtext: "Volunteering opportunities",
      icon: Sparkles,
    },
    {
      title: "Acts of Kindness",
      value: metrics ? metrics.acts_of_kindness.toLocaleString() : "-",
      subtext: "Community tasks completed",
      icon: HandHeart,
    },
    {
      title: "Helping Hands",
      value: metrics ? metrics.helping_hands.toLocaleString() : "-",
      subtext: "Unique volunteers",
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-purple-600">
            Welcome back, {organizerProfile?.org_name ?? "friend"}!
          </h1>
          <p className="font-inter text-xs sm:text-sm text-purple-600/60 mt-1">
            Here is a look at the impact your community is making today.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
          {error}
        </div>
      )}

      {/* Upper Row Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-2xl border border-purple-200/60 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-purple-50 border-purple-200/60 text-purple-600">
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50 truncate">
                  {card.title}
                </p>
                <h3 className="font-sora text-2xl font-extrabold text-purple-600 mt-0.5 tracking-tight truncate">
                  {loading ? "—" : card.value}
                </h3>
                <p className="font-inter text-xs text-purple-600/60 truncate mt-0.5">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower Row Calendar View */}
      <div className="rounded-2xl border border-purple-200/60 bg-white p-4 sm:p-6 shadow-xs">
        {/* Calendar Header Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-purple-600" />
              <h2 className="font-sora text-lg sm:text-xl font-extrabold text-purple-600">Activity Schedule</h2>
            </div>
            <p className="font-inter text-xs text-purple-600/60 mt-0.5">
              Keep track of your upcoming activities and volunteer blocks.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="font-sora text-sm font-bold text-purple-600 mr-2">
              {MONTH_LABELS[month]} {year}
            </span>
            <button
              type="button"
              onClick={goToPrevMonth}
              disabled={!canGoPrev}
              className="rounded-xl border border-purple-200/60 bg-purple-50/50 p-2 text-purple-600 transition-colors
                         hover:bg-purple-600 hover:text-white cursor-pointer disabled:cursor-not-allowed
                         disabled:opacity-40 disabled:hover:bg-purple-50/50 disabled:hover:text-purple-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
              disabled={!canGoNext}
              className="rounded-xl border border-purple-200/60 bg-purple-50/50 p-2 text-purple-600 transition-colors
                         hover:bg-purple-600 hover:text-white cursor-pointer disabled:cursor-not-allowed
                         disabled:opacity-40 disabled:hover:bg-purple-50/50 disabled:hover:text-purple-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsive Calendar Grid Container */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[640px]">
            {/* Days of Week Header Grid */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
              {WEEKDAY_LABELS.map((day) => (
                <div
                  key={day}
                  className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Monthly Day Blocks Grid */}
            <div className="grid grid-cols-7 gap-2 auto-rows-[90px] sm:auto-rows-[100px]">
              {Array.from({ length: leadingBlanks }, (_, i) => (
                <div key={`blank-${i}`} className="rounded-xl border border-transparent bg-purple-50/20" />
              ))}

              {calendarDays.map((day) => {
                const dayActivities = activitiesByDay[day] ?? [];

                return (
                  <div
                    key={day}
                    className="group flex flex-col justify-between rounded-xl border border-purple-100 bg-purple-50/30 p-2
                               transition-all hover:border-purple-300 hover:bg-white hover:shadow-xs"
                  >
                    <span className="font-sora text-xs font-extrabold text-purple-600/80">{day}</span>

                    <div className="space-y-1 overflow-y-auto max-h-15 no-scrollbar">
                      {dayActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="truncate rounded-md bg-purple-600 px-1.5 py-0.5 font-sora text-[10px] font-bold text-white shadow-2xs"
                          title={activity.name}
                        >
                          {activity.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}