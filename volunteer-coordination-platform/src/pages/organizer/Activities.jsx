import ActivityCard from "../../components/activities/ActivityCard";
import { Link } from "react-router-dom";

const sampleActivities = [
  {
    id: "1",
    title: "Beach Cleanup at Pantai Bagan",
    image: "https://picsum.photos/seed/beach-cleanup/300/300",
    date: "2026-08-15T09:00:00",
    status: "upcoming",
    category: "Environment",
    shortLocation: "Klang, Selangor",
    volunteersFilled: 15,
    volunteersCapacity: 20,
  },
  {
    id: "2",
    title: "Weekend Food Bank Sorting",
    image: "https://picsum.photos/seed/food-bank/300/300",
    date: "2026-07-12T10:00:00",
    status: "active",
    category: "Community",
    shortLocation: "Petaling Jaya",
    volunteersFilled: 8,
    volunteersCapacity: 10,
  },
  {
    id: "3",
    title: "Reading Buddies at SJK Harmoni",
    image: "https://picsum.photos/seed/reading-buddies/300/300",
    date: "2026-06-02T14:00:00",
    status: "completed",
    category: "Education",
    shortLocation: "Shah Alam",
    volunteersFilled: 12,
    volunteersCapacity: 12,
  },
  {
    id: "4",
    title: "Charity Fun Run Marshalling",
    image: "https://picsum.photos/seed/fun-run/300/300",
    date: "2026-09-01T07:00:00",
    status: "cancelled",
    category: "Sports",
    shortLocation: "Subang Jaya",
    volunteersFilled: 4,
    volunteersCapacity: 25,
  },
];

export default function Activities() {
  return (
    <div>
      <h1 className="font-sora text-3xl font-extrabold text-purple-600 mb-6">
        Activities
      </h1>

      <Link to="new">
        <button
          className="px-7 py-3 rounded-md text-sm font-bold bg-purple-600 text-purple-300 font-sora
                           transition-all duration-200 hover:bg-purple-800
                           active:scale-95 cursor-pointer"
        >
          Create New Activity
        </button>
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {sampleActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            {...activity}
            onEdit={() => console.log("edit", activity.id)}
            onTrack={() => console.log("track", activity.id)}
            onViewApplicants={() => console.log("applicants", activity.id)}
          />
        ))}
      </div>
    </div>
  );
}
