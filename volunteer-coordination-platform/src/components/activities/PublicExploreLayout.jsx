import { Outlet } from "react-router-dom";
import TopNavBar from "../../components/common/TopNavBar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-purple-50">
      <TopNavBar />
      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
}