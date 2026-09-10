import { Plus } from "lucide-react";
import { useState } from "react";
import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";
import { useUser } from "@clerk/react";

const Dashboard = () => {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {user?.fullName
              ? `${user.fullName.split(" ")[0]}'s Workspace`
              : "Workspace"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Overview of your projects, tasks, and activity
          </p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="app-primary flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      <CreateProjectDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      {/* MAIN LAYOUT */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* LEFT SIDEBAR (ONLY TASKS) */}
        <div className="space-y-6">
          <div className="app-panel rounded-2xl p-5">
            <TasksSummary />
          </div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="space-y-6">
          {/* INSIGHTS (NOW ABOVE PROJECT OVERVIEW ✅) */}
          <div className="app-panel rounded-2xl p-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Insights
            </p>

            {/* slight scale to fit nicely */}
            <div className="scale-[0.97] origin-top">
              <StatsGrid />
            </div>
          </div>

          {/* PROJECT OVERVIEW */}
          <div className="app-panel rounded-2xl p-5">
            <ProjectOverview />
          </div>

          {/* RECENT ACTIVITY */}
          <div className="app-panel rounded-2xl p-5">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;