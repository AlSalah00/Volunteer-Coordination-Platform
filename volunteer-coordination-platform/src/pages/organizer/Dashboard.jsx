import { useOutletContext } from "react-router-dom";
import { 
  Heart, 
  Sparkles, 
  HandHeart, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon
} from "lucide-react";

export default function Dashboard() {
  const { organizerProfile } = useOutletContext() || {};

  // TODO: Replace with real aggregated real-time counts from Supabase tables
  const metrics = [
    {
      title: "Hours Gifted",
      value: "1,240 hrs",
      subtext: "Scheduled time contributed",
      icon: Heart,
      iconContainer: "bg-purple-50 border-purple-200/60 text-purple-600",
    },
    {
      title: "Activities Shared",
      value: "18",
      subtext: "Opportunities shared",
      icon: Sparkles,
      iconContainer: "bg-purple-50 border-purple-200/60 text-purple-600",
    },
    {
      title: "Acts of Kindness",
      value: "84",
      subtext: "Community tasks completed",
      icon: HandHeart,
      iconContainer: "bg-purple-50 border-purple-200/60 text-purple-600",
    },
    {
      title: "Helping Hands",
      value: "312",
      subtext: "Unique volunteers",
      icon: Users,
      iconContainer: "bg-purple-50 border-purple-200/60 text-purple-600",
    },
  ];

  // TODO: Replace with real dynamic query filtering for the current month from Supabase
  const mockActivities = [
    { id: 1, day: 8, title: "Park Cleanup", type: "environmental" },
    { id: 2, day: 14, title: "Soup Kitchen Shift", type: "social" },
    { id: 3, day: 22, title: "Senior Tech Workshop", type: "education" },
    { id: 4, day: 22, title: "Food Drive Sorting", type: "social" },
  ];

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen w-full bg-purple-50">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-sora text-3xl font-extrabold text-purple-600">
              Welcome back, {organizerProfile?.org_name ?? "friend"}!
            </h1>
            <p className="font-inter text-sm text-purple-600/60 mt-1">
              Here is a look at the impact your community is making today.
            </p>
          </div>
        </div>

        {/* 1. Upper Row: Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {metrics.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-4 rounded-2xl border border-purple-200/60 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${card.iconContainer}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50 truncate">
                    {card.title}
                  </p>
                  <h3 className="font-sora text-2xl font-extrabold text-purple-600 mt-0.5 tracking-tight truncate">
                    {card.value}
                  </h3>
                  <p className="font-inter text-xs text-purple-600/60 truncate mt-0.5">
                    {card.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Lower Row: Calendar View */}
        <div className="rounded-2xl border border-purple-200/60 bg-white p-6 shadow-xs">
          
          {/* Calendar Header Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
                <h2 className="font-sora text-xl font-extrabold text-purple-600">
                  Activity Schedule
                </h2>
              </div>
              <p className="font-inter text-xs text-purple-600/60 mt-0.5">
                Keep track of your upcoming activities and volunteer blocks.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="font-sora text-sm font-bold text-purple-600 mr-2">
                July 2026
              </span>
              <button 
                type="button" 
                className="rounded-xl border border-purple-200/60 bg-purple-50/50 p-2 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                className="rounded-xl border border-purple-200/60 bg-purple-50/50 p-2 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header Grid */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Monthly Day Blocks Grid */}
          <div className="grid grid-cols-7 gap-2 auto-rows-[100px]">
            {/* Offset cells for month alignment */}
            <div className="rounded-xl border border-transparent bg-purple-50/20" />
            <div className="rounded-xl border border-transparent bg-purple-50/20" />
            <div className="rounded-xl border border-transparent bg-purple-50/20" />
            
            {calendarDays.map((day) => {
              const dayActivities = mockActivities.filter(act => act.day === day);

              return (
                <div 
                  key={day} 
                  className="group flex flex-col justify-between rounded-xl border border-purple-100 bg-purple-50/30 p-2 transition-all hover:border-purple-300 hover:bg-white hover:shadow-xs cursor-pointer"
                >
                  <span className="font-sora text-xs font-extrabold text-purple-600/80">
                    {day}
                  </span>
                  
                  {/* Event indicators inside calendar block */}
                  <div className="space-y-1 overflow-y-auto max-h-15 no-scrollbar">
                    {dayActivities.map((activity) => (
                      <div 
                        key={activity.id}
                        className="truncate rounded-md bg-purple-600 px-1.5 py-0.5 font-sora text-[10px] font-bold text-white shadow-2xs"
                        title={activity.title}
                      >
                        {activity.title}
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
  );
}