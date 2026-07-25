import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import PublicRoute from "../components/routing/PublicRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import VolunteerHomepage from "../pages/VolunteerHomepage";
import AuthCallback from "../pages/AuthCallback";
import OrganizerLayout from "../components/organizer/OrganizerLayout";
import Dashboard from "../pages/organizer/Dashboard";
import Activities from "../pages/organizer/Activities";
import ActivityForm from "../pages/organizer/ActivityForm";
import ActivityDetails from "../pages/organizer/ActivityDetails";
import ActivityTracking from "../pages/organizer/ActivityTracking";
import Recruit from "../pages/organizer/Recruit";
import Reviews from "../pages/organizer/Reviews";
import OrgProfile from "../pages/organizer/OrgProfile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="/volunteer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["volunteer"]}>
            <VolunteerHomepage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer"
        element={
          <ProtectedRoute allowedRoles={["organizer"]}>
            <OrganizerLayout />
          </ProtectedRoute>
        }
      >

        <Route index element={<Dashboard />} /> 
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="activities" element={<Activities />} />
        <Route path="activities/new" element={<ActivityForm />} />
        <Route path="activities/:id" element={<ActivityDetails />} />
        <Route path="activities/:id/edit" element={<ActivityForm />} />
        <Route path="activities/:id/track" element={<ActivityTracking />} />
        <Route path="recruit" element={<Recruit />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="profile" element={<OrgProfile />} />
      </Route> 
    </Routes>
  );
}
