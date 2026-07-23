import { useOutletContext } from "react-router-dom";
import { 
  Heart, 
  Sparkles, 
  HandHeart, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from "lucide-react";

export default function Dashboard() {
  const { organizerProfile } = useOutletContext();

  // TODO: Replace with real aggregated real-time counts from Supabase tables
  const metrics = [
    {
      title: "Hours Gifted",
      value: "1,240 hrs",
      subtext: "Time dedicated by neighbors",
      icon: Heart,
      bgClass: "bg-teal-50 text-teal-600",
      iconBg: "bg-teal-400/20 text-teal-600"
    },
    {
      title: "Activities Shared",
      value: "18",
      subtext: "Gatherings & projects hosted",
      icon: Sparkles,
      bgClass: "bg-amber-50 text-amber-800",
      iconBg: "bg-amber-400/20 text-amber-800"
    },
    {
      title: "Helping Hands",
      value: "84",
      subtext: "Completed community tasks",
      icon: HandHeart,
      bgClass: "bg-coral-50 text-coral-600",
      iconBg: "bg-coral-600/10 text-coral-600"
    },
    {
      title: "Our Supporters",
      value: "312",
      subtext: "Unique friendly volunteers",
      icon: Users,
      bgClass: "bg-purple-50 text-purple-800",
      iconBg: "bg-purple-300/30 text-purple-800"
    },
  ];

  // TODO: Replace with real dynamic query filtering for the current month from Supabase
  const mockActivities = [
    { id: 1, day: 8, title: "Park Cleanup", type: "environmental" },
    { id: 2, day: 14, title: "Soup Kitchen Shift", type: "social" },
    { id: 3, day: 22, title: "Senior Tech Workshop", type: "education" },
    { id: 4, day: 22, title: "Food Drive Sorting", type: "social" },
  ];

  // Simple hardcoded calendar grid representation for demonstration
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sora text-3xl font-bold text-purple-800 tracking-wide">
            Welcome back, {organizerProfile?.org_name ?? "friend"}!
          </h1>
          <p className="font-inter text-sm text-purple-600 mt-1">
            Here is a look at the beautiful impact your community is making today.
          </p>
        </div>
      </div>

      {/* 1. Upper Row: Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`p-6 rounded-3xl bg-purple-300 flex flex-col justify-between min-h-37.5 shadow-xs`}
            >
              <div className="flex items-start justify-between">
                <span className="font-sora text-sm font-bold opacity-90 text-purple-600">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-purple-200/20 text-purple-600`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-sora text-3xl font-bold tracking-wide text-purple-800">
                  {card.value}
                </h3>
                <p className="font-inter text-xs opacity-75 mt-1 text-purple-600">
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Lower Row: Calendar View */}
      <div className="bg-purple-50/30 rounded-3xl p-6 border border-purple-300 shadow-xs">
        
        {/* Calendar Header Control */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-sora text-xl font-bold text-purple-800">
              Community Schedule
            </h2>
            <p className="font-inter text-xs text-purple-600">
              Keep track of your upcoming gatherings and volunteer blocks.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-sora text-sm font-bold text-purple-800 mr-2">
              July 2026
            </span>
            <button className="p-2 rounded-xl bg-purple-50/50 text-purple-600 hover:bg-purple-600 hover:text-purple-50 transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-purple-50/50 text-purple-600 hover:bg-purple-600 hover:text-purple-50 transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-sora text-xs font-bold text-purple-800/60 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Monthly Day Blocks Grid */}
        <div className="grid grid-cols-7 gap-2 auto-rows-[100px]">
          {/* Empty mock block cells to align calendar start offset day if needed */}
          <div className="bg-purple-200/10 rounded-2xl border border-transparent" />
          <div className="bg-purple-200/10 rounded-2xl border border-transparent" />
          <div className="bg-purple-200/10 rounded-2xl border border-transparent" />
          
          {calendarDays.map((day) => {
            // Check if there are active events assigned to this day item
            const dayActivities = mockActivities.filter(act => act.day === day);

            return (
              <div 
                key={day} 
                className="bg-purple-200/40 hover:bg-purple-50/80 transition-colors rounded-2xl p-2 flex flex-col justify-between border border-purple-200/20 group cursor-pointer"
              >
                <span className="font-sora text-xs font-bold text-purple-800/80">
                  {day}
                </span>
                
                {/* Event indicators inside the grid square block */}
                <div className="space-y-1 overflow-y-auto max-h-17.5 no-scrollbar">
                  {dayActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className={`text-[10px] font-sora font-bold px-1.5 py-0.5 rounded-md truncate bg-purple-600 text-purple-50
                      }`}
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
  );
}