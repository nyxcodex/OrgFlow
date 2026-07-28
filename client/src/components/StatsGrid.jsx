import {
  FolderOpen,
  CheckCircle,
  ListChecks,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function StatsGrid() {
  const currentWorkspace = useSelector(
    (state) => state?.workspace?.currentWorkspace || null,
  );

  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    myTasks: 0,
    overdueIssues: 0,
  });

  const statCards = [
    {
      icon: FolderOpen,
      title: "Total Projects",
      value: stats.totalProjects,
      subtitle: `projects in ${currentWorkspace?.name}`,
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: CheckCircle,
      title: "Completed",
      value: stats.completedProjects,
      subtitle: `of ${stats.totalProjects} total`,
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: ListChecks, 
      title: "My Tasks",
      value: stats.myTasks,
      subtitle: "assigned to me",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: AlertTriangle,
      title: "Overdue",
      value: stats.overdueIssues,
      subtitle: "need attention",
      bgColor: "bg-red-500/10",
      textColor: "text-red-600 dark:text-red-400",
    },
  ];

  useEffect(() => {
    if (currentWorkspace) {
      setStats({
        totalProjects: currentWorkspace.projects.length,
        activeProjects: currentWorkspace.projects.filter(
          (p) => p.status !== "CANCELLED" && p.status !== "COMPLETED",
        ).length,
        completedProjects: currentWorkspace.projects
          .filter((p) => p.status === "COMPLETED")
          .reduce((acc, project) => acc + project.tasks.length, 0),
        myTasks: currentWorkspace.projects.reduce(
          (acc, project) =>
            acc +
            project.tasks.filter(
              (t) => t.assignee?.email === currentWorkspace.owner.email,
            ).length,
          0,
        ),
        overdueIssues: currentWorkspace.projects.reduce(
          (acc, project) =>
            acc + project.tasks.filter((t) => t.due_date < new Date()).length,
          0,
        ),
      });
    }
  }, [currentWorkspace]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 my-8">
      {statCards.map(
        ({ icon: Icon, title, value, subtitle, bgColor, textColor }, i) => (
          <div
            key={i}
            className="app-panel hover:border-violet-200 dark:hover:border-violet-500/30 transition duration-200 rounded-xl"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                    {title}
                  </p>
                  <p className="text-3xl font-bold text-zinc-800 dark:text-white">
                    {value}
                  </p>
                  {subtitle && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
                  <Icon size={20} className={textColor} />
                </div>
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
