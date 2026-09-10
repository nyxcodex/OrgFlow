import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { CheckCircle, Clock, AlertTriangle, Users, ArrowRightIcon } from "lucide-react";

// Colors for charts and priorities
const COLORS = ["#6d28d9", "#059669", "#f59e0b", "#e11d48", "#0f766e"];
const PRIORITY_COLORS = {
    LOW: "text-red-600 bg-red-200 dark:text-red-500 dark:bg-red-600",
    MEDIUM: "text-blue-600 bg-blue-200 dark:text-blue-500 dark:bg-blue-600",
    HIGH: "text-emerald-600 bg-emerald-200 dark:text-emerald-500 dark:bg-emerald-600",
};

const ProjectAnalytics = ({ project, tasks }) => {
    const { stats, statusData, typeData, priorityData } = useMemo(() => {
        const now = new Date();
        const total = tasks.length;

        const stats = {
            total,
            completed: 0,
            inProgress: 0,
            todo: 0,
            overdue: 0,
        };

        const statusMap = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        const typeMap = { TASK: 0, BUG: 0, FEATURE: 0, IMPROVEMENT: 0, OTHER: 0 };
        const priorityMap = { LOW: 0, MEDIUM: 0, HIGH: 0 };

        tasks.forEach((t) => {
            if (t.status === "DONE") stats.completed++;
            if (t.status === "IN_PROGRESS") stats.inProgress++;
            if (t.status === "TODO") stats.todo++;
            if (new Date(t.due_date) < now && t.status !== "DONE") stats.overdue++;

            if (statusMap[t.status] !== undefined) statusMap[t.status]++;
            if (typeMap[t.type] !== undefined) typeMap[t.type]++;
            if (priorityMap[t.priority] !== undefined) priorityMap[t.priority]++;
        });

        return {
            stats,
            statusData: Object.entries(statusMap).map(([k, v]) => ({ name: k.replace("_", " "), value: v })),
            typeData: Object.entries(typeMap).filter(([, v]) => v > 0).map(([k, v]) => ({ name: k, value: v })),
            priorityData: Object.entries(priorityMap).map(([k, v]) => ({
                name: k,
                value: v,
                percentage: total > 0 ? Math.round((v / total) * 100) : 0,
            })),
        };
    }, [tasks]);

    const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

    const metrics = [
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            color: "text-emerald-600 dark:text-emerald-400",
            icon: <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />,
            bg: "bg-emerald-200 dark:bg-emerald-500/10",
        },
        {
            label: "Active Tasks",
            value: stats.inProgress,
            color: "text-violet-700 dark:text-violet-300",
            icon: <Clock className="size-5 text-violet-700 dark:text-violet-300" />,
            bg: "bg-violet-100 dark:bg-violet-500/10",
        },
        {
            label: "Overdue Tasks",
            value: stats.overdue,
            color: "text-red-600 dark:text-red-400",
            icon: <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />,
            bg: "bg-red-200 dark:bg-red-500/10",
        },
        {
            label: "Team Size",
            value: project?.members?.length || 0,
            color: "text-purple-600 dark:text-purple-400",
            icon: <Users className="size-5 text-purple-600 dark:text-purple-400" />,
            bg: "bg-purple-200 dark:bg-purple-500/10",
        },
    ];

    return (
        <div className="space-y-5">
            {/* Metrics */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {metrics.map((m, i) => (
                    <div
                        key={i}
                        className="app-panel rounded-xl p-4 sm:p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{m.label}</p>
                                <p className={`text-2xl font-extrabold tracking-tight ${m.color}`}>{m.value}</p>
                            </div>
                            <div className={`p-2 rounded-md ${m.bg}`}>{m.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-5">
                {/* Tasks by Status */}
                <div className="app-panel rounded-xl p-6">
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">Workflow</p>
                            <h2 className="text-zinc-900 dark:text-white font-semibold">Tasks by status</h2>
                        </div>
                        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">{stats.total} total</span>
                    </div>
                    <ResponsiveContainer width="100%" height={270}>
                        <BarChart data={statusData} layout="vertical" margin={{ left: 12, right: 18 }}>
                            <XAxis
                                type="number"
                                dataKey="name"
                                tick={{ fill: "#52525b", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis dataKey="name" type="category" width={86} tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: "rgba(109, 40, 217, 0.06)" }} contentStyle={{ borderRadius: 10, border: "1px solid #e7e4ed" }} />
                            <Bar dataKey="value" fill="#6d28d9" radius={[0, 6, 6, 0]} barSize={22} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tasks by Type */}
                <div className="app-panel rounded-xl p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">Distribution</p>
                    <h2 className="text-zinc-900 dark:text-white mb-2 font-semibold">Work by type</h2>
                    <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-center gap-3">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={typeData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={52}
                                outerRadius={76}
                                paddingAngle={4}
                                stroke="none"
                            >
                                {typeData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="w-full space-y-2">
                        {typeData.map((item, i) => <div key={item.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300"><i className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />{item.name}</span><strong className="text-zinc-900 dark:text-white">{item.value}</strong></div>)}
                    </div>
                    </div>
                </div>
            </div>

            {/* Priority Breakdown */}
            <div className="app-panel rounded-xl p-6">
                <div className="flex items-center justify-between mb-5"><div><p className="text-xs uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">Focus</p><h2 className="text-zinc-900 dark:text-white font-semibold">Priority split</h2></div><span className="text-sm text-zinc-500 dark:text-zinc-400">Open work at a glance</span></div>
                <div className="space-y-4">
                    {priorityData.map((p) => (
                        <div key={p.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <ArrowRightIcon className={`size-3.5 ${PRIORITY_COLORS[p.name]} bg-transparent dark:bg-transparent`} />
                                    <span className="text-zinc-900 dark:text-zinc-200 capitalize">{p.name.toLowerCase()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-600 dark:text-zinc-400 text-sm">{p.value} tasks</span>
                                    <span className="px-2 py-0.5 border border-zinc-400 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs rounded">
                                        {p.percentage}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-zinc-300 dark:bg-zinc-800 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${PRIORITY_COLORS[p.name]}`}
                                    style={{ width: `${p.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectAnalytics;
