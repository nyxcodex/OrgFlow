import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, UsersIcon, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CreateProjectDialog from "./CreateProjectDialog";

const ProjectOverview = () => {
    const statusColors = {
        PLANNING: "border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-300",
        ACTIVE: "border-teal-300 text-teal-700 dark:border-teal-700 dark:text-teal-300",
        ON_HOLD: "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300",
        COMPLETED: "border-sky-300 text-sky-700 dark:border-sky-700 dark:text-sky-300",
        CANCELLED: "border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-300"
    };

    const priorityColors = {
        LOW: "border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-400",
        MEDIUM: "border-sky-300 text-sky-700 dark:border-sky-700 dark:text-sky-300",
        HIGH: "border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-300",
    };

    const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects(currentWorkspace?.projects || []);
    }, [currentWorkspace]);

    return currentWorkspace && (
        <div className="app-panel hover:border-violet-200 dark:hover:border-violet-500/30 transition-all duration-200 rounded-xl overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                <h2 className="text-md text-zinc-800 dark:text-zinc-300">Project Overview</h2>
                <Link to={'/projects'} className="text-sm text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 flex items-center">
                    View all <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>

            <div className="p-0">
                {projects.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500 rounded-full flex items-center justify-center">
                            <FolderOpen size={32} />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">No projects yet</p>
                        <button onClick={() => setIsDialogOpen(true)} className="app-primary mt-4 px-4 py-2 text-sm rounded-lg transition">
                            Create your First Project
                        </button>
                        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {projects.slice(0, 5).map((project) => (
                            <Link key={project.id} to={`/projectsDetail?id=${project.id}&tab=tasks`} className="grid md:grid-cols-[minmax(0,1fr)_210px] gap-4 p-5 hover:bg-violet-50/50 dark:hover:bg-[#24212d] transition-colors">
                                <div className="flex items-start justify-between md:block">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                            {project.description || 'No description'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4 md:mt-3 md:ml-0">
                                        <span className={`app-tag ${statusColors[project.status]}`}>
                                            {project.status.replace('_', ' ').replaceAll(/\b\w/g, c => c.toUpperCase())}
                                        </span>
                                        <span className={`app-tag ${priorityColors[project.priority]}`}>{project.priority}</span>
                                    </div>
                                </div>

                                <div className="md:col-start-2 md:row-start-1 flex flex-col justify-between text-xs text-zinc-500 dark:text-zinc-500">
                                    <div className="flex items-center gap-4 justify-end">
                                        {project.members?.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <UsersIcon className="w-3 h-3" />
                                                {project.members.length} members
                                            </div>
                                        )}
                                        {project.end_date && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(project.end_date), "MMM d, yyyy")}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 self-end">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-zinc-500 dark:text-zinc-500">Progress</span>
                                        <span className="text-zinc-600 dark:text-zinc-400">{project.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded h-1.5">
                                        <div className="h-1.5 bg-violet-600 rounded" style={{ width: `${project.progress || 0}%` }} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectOverview;
