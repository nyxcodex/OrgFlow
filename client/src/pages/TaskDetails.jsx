import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarIcon, MessageCircle, PenIcon } from "lucide-react";
import { useAuth, useUser } from "@clerk/react";
import api from "../configs/api";

const TaskDetails = () => {

    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const taskId = searchParams.get("taskId");

    const {user} = useUser()
    const {getToken} = useAuth()

    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    const { currentWorkspace } = useSelector((state) => state.workspace);

    const fetchComments = async () => {
        if(!taskId) return
        try {
            const token = await getToken()
            const {data} = await api.get(`/api/comments/${taskId}`, {headers: {
                Authorization: `Bearer ${token}`
            }})
            setComments(data.comments || [])
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    };

    const fetchTaskDetails = async () => {
        setLoading(true);
        if (!projectId || !taskId) return;

        const proj = currentWorkspace.projects.find((p) => p.id === projectId);
        if (!proj) return;

        const tsk = proj.tasks.find((t) => t.id === taskId);
        if (!tsk) return;

        setTask(tsk);
        setProject(proj);
        setLoading(false);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {

            toast.loading("Adding comment...");

            const token = await getToken();
            const {data} = await api.post(`/api/comments`, {taskId: task.id, content: newComment}, {headers: {
                Authorization: `Bearer ${token}`}})
            
            setComments((prev) => [...prev, data.comment]);
            setNewComment("");
            toast.dismissAll();
            toast.success("Comment added.");
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.response?.data?.message || error.message);
            console.error(error);
        }
    };

    useEffect(() => { fetchTaskDetails(); }, [taskId]);

    useEffect(() => {
        if (taskId && task) {
            fetchComments();
            const interval = setInterval(() => { fetchComments(); }, 10000);
            return () => clearInterval(interval);
        }
    }, [taskId, task]);

    if (loading) return <div className="text-gray-500 dark:text-zinc-400 px-4 py-6">Loading task details...</div>;
    if (!task) return <div className="text-red-500 px-4 py-6">Task not found.</div>;

    return (
        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-6 text-gray-900 dark:text-zinc-100 max-w-7xl mx-auto">
            {/* Left: Comments / Chatbox */}
            <div className="w-full lg:order-2">
                <div className="p-5 rounded-md  border border-gray-300 dark:border-zinc-800  flex flex-col lg:h-[80vh]">
                    <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                        <MessageCircle className="size-5" /> Task Discussion ({comments.length})
                    </h2>

                    <div className="flex-1 md:overflow-y-scroll no-scrollbar">
                        {comments.length > 0 ? (
                            <div className="flex flex-col gap-4 mb-6 mr-2">
                                {comments.map((comment) => (
                                    <div key={comment.id} className={`sm:max-w-4/5 border border-gray-300 bg-white dark:border-zinc-700 dark:bg-[#201e28] p-3 rounded-lg ${comment.user.id === user?.id ? "ml-auto" : "mr-auto"}`} >
                                        <div className="flex items-center gap-2 mb-1 text-sm text-gray-500 dark:text-zinc-400">
                                            <img src={comment.user.image} alt="avatar" className="size-5 rounded-full" />
                                            <span className="font-medium text-gray-900 dark:text-white">{comment.user.name}</span>
                                            <span className="text-xs text-gray-400 dark:text-zinc-600">
                                                • {format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-zinc-200">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-zinc-500 mb-4 text-sm">No comments yet. Be the first!</p>
                        )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md p-2 text-sm text-gray-900 dark:text-zinc-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
                            rows={3}
                        />
                        <button onClick={handleAddComment} className="app-primary transition-colors text-sm px-5 py-2 rounded-lg" >
                            Post
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Task + Project Info */}
            <aside className="w-full lg:order-1 flex flex-col gap-6 lg:sticky lg:top-0 lg:self-start">
                {/* Task Info */}
                <div className="p-5 rounded-md bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 ">
                    <div className="mb-3">
                        <h1 className="text-lg font-medium text-gray-900 dark:text-zinc-100">{task.title}</h1>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className={`app-tag ${task.status === "DONE" ? "border-teal-300 text-teal-700 dark:border-teal-700 dark:text-teal-300" : task.status === "IN_PROGRESS" ? "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300" : "border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-300"}`}>
                                {task.status}
                            </span>
                            <span className="app-tag border-sky-300 text-sky-700 dark:border-sky-700 dark:text-sky-300">
                                {task.type}
                            </span>
                            <span className="app-tag border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-300">
                                {task.priority}
                            </span>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">{task.description}</p>
                    )}

                    <hr className="border-zinc-200 dark:border-zinc-700 my-3" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-2">
                            {task.assignee?.image ? (
                                <img src={task.assignee.image} className="size-5 rounded-full" alt={task.assignee.name || "assignee"} />
                            ) : (
                                <span className="size-5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-[9px] font-semibold flex items-center justify-center">
                                    {(task.assignee?.name || task.assignee?.email || "U").slice(0, 1).toUpperCase()}
                                </span>
                            )}
                            <span>
                                <span className="block">{task.assignee?.name || "Unassigned"}</span>
                                {task.assignee?.email && <span className="block text-xs text-gray-500 dark:text-zinc-400">{task.assignee.email}</span>}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-4 text-gray-500 dark:text-zinc-500" />
                            Due : {format(new Date(task.due_date), "dd MMM yyyy")}
                        </div>
                    </div>
                </div>

                {/* Project Info */}
                {project && (
                    <div className="p-4 rounded-md bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-gray-300 dark:border-zinc-800 ">
                        <p className="text-xl font-medium mb-4">Project Details</p>
                        <h2 className="text-gray-900 dark:text-zinc-100 flex items-center gap-2"> <PenIcon className="size-4" /> {project.name}</h2>
                        <p className="text-xs mt-3">Project Start Date: {format(new Date(project.start_date), "dd MMM yyyy")}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-zinc-400 mt-3">
                            <span>Status: {project.status}</span>
                            <span>Priority: {project.priority}</span>
                            <span>Progress: {project.progress}%</span>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default TaskDetails;
