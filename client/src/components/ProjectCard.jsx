import { Link } from "react-router-dom";

const statusColors = {
    PLANNING: "border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-300",
    ACTIVE: "border-teal-300 text-teal-700 dark:border-teal-700 dark:text-teal-300",
    ON_HOLD: "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300",
    COMPLETED: "border-sky-300 text-sky-700 dark:border-sky-700 dark:text-sky-300",
    CANCELLED: "border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-300",
};

const ProjectCard = ({ project }) => {
    return (
        <Link to={`/projectsDetail?id=${project.id}&tab=tasks`} className="app-panel hover:border-violet-200 dark:hover:border-violet-500/30 rounded-xl p-5 transition-all duration-200 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-200 mb-1 truncate group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                        {project.name}
                    </h3>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm line-clamp-2 mb-3">
                        {project.description || "No description"}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <span className={`app-tag ${statusColors[project.status]}`} >
                    {project.status.replace("_", " ")}
                </span>
                <span className="app-tag border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                    {project.priority} priority
                </span>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-zinc-500">Progress</span>
                    <span className="text-gray-400 dark:text-zinc-400">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded">
                    <div className="h-1.5 rounded bg-violet-600" style={{ width: `${project.progress || 0}%` }} />
                </div>
            </div>

            </Link>
    );
};

export default ProjectCard;
