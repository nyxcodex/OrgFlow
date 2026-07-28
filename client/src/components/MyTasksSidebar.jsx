import { useEffect, useState } from 'react';
import { CheckSquareIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function MyTasksSidebar() {

    const user = { id: 'user_1' }

    const { currentWorkspace } = useSelector((state) => state.workspace);
    const [showMyTasks, setShowMyTasks] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    const toggleMyTasks = () => setShowMyTasks(prev => !prev);

    const getTaskStatusStyle = (status) => {
        switch (status) {
            case 'DONE':
                return 'border-l-teal-500 bg-teal-50/60 dark:border-l-teal-400 dark:bg-teal-500/5 text-teal-700 dark:text-teal-300';
            case 'IN_PROGRESS':
                return 'border-l-amber-500 bg-amber-50/60 dark:border-l-amber-400 dark:bg-amber-500/5 text-amber-700 dark:text-amber-300';
            default:
                return 'border-l-zinc-400 bg-zinc-50 dark:border-l-zinc-500 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300';
        }
    };

    const fetchUserTasks = () => {
        const userId = user?.id || '';
        if (!userId || !currentWorkspace) return;
        const currentWorkspaceTasks = currentWorkspace.projects.flatMap((project) => {
            return project.tasks.filter((task) => task?.assignee?.id === userId);
        });

        setMyTasks(currentWorkspaceTasks);
    }

    useEffect(() => {
        fetchUserTasks()
    }, [currentWorkspace])

    return (
        <div className="mt-5 px-3">
            <div onClick={toggleMyTasks} className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer hover:bg-violet-50 dark:hover:bg-[#24212d]" >
                <div className="flex items-center gap-2">
                    <CheckSquareIcon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                    <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">My Tasks</h3>
                    <span className="bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded">
                        {myTasks.length}
                    </span>
                </div>
                {showMyTasks ? (
                    <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                ) : (
                    <ChevronRightIcon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                )}
            </div>

            {showMyTasks && (
                <div className="mt-2 pl-2">
                    <div className="space-y-1">
                        {myTasks.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-gray-500 dark:text-zinc-500 text-center">
                                No tasks assigned
                            </div>
                        ) : (
                            myTasks.map((task, index) => (
                                <Link key={index} to={`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`} className={`block w-full border-l-[3px] rounded-r-lg transition-all duration-200 hover:brightness-95 dark:hover:brightness-110 ${getTaskStatusStyle(task.status)}`} >
                                    <div className="flex items-center gap-2 px-3 py-2 w-full min-w-0">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">
                                                {task.title}
                                            </p>
                                            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] opacity-75">
                                                {task.status.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyTasksSidebar;
