import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  FolderKanban,
  Settings,
  ChartColumn,
  CalendarDays,
  ListTodo,
  ArrowRight,
} from "lucide-react";
import { useSelector } from "react-redux";

const ProjectSidebar = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [expandedProjects, setExpandedProjects] = useState(new Set());

  const projects = useSelector(
    (state) => state?.workspace?.currentWorkspace?.projects || [],
  );

  const getProjectSubItems = (projectId) => [
    {
      title: "Tasks",
      icon: ListTodo,
      url: `/projectsDetail?id=${projectId}&tab=tasks`,
    },
    {
      title: "Analytics",
      icon: ChartColumn,
      url: `/projectsDetail?id=${projectId}&tab=analytics`,
    },
    {
      title: "Calendar",
      icon: CalendarDays,
      url: `/projectsDetail?id=${projectId}&tab=calendar`,
    },
  ];

  const toggleProject = (id) => {
    const newSet = new Set(expandedProjects);

    newSet.has(id) ? newSet.delete(id) : newSet.add(id);

    setExpandedProjects(newSet);
  };

  return (
    <div className="mt-6 px-3 border-t border-[#e7e4ed] pt-4 dark:border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between px-3 mb-3">
        <h3
          className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-zinc-400
                    dark:text-zinc-500
                "
        >
          Projects
        </h3>

        <Link to="/projects">
          <button
            className="
                        size-6
                        flex
                        items-center
                        justify-center
                        rounded-md
                        text-zinc-400
                        hover:text-zinc-900
                        hover:bg-zinc-100
                        dark:hover:text-white
                        dark:hover:bg-zinc-800
                        transition
                    "
          >
            <ArrowRight size={13} />
          </button>
        </Link>
      </div>

      <div className="space-y-2 px-2">
        {projects.map((project) => (
          <div key={project.id}>
            {/* Project Row */}
            <button
              onClick={() => toggleProject(project.id)}
              className="
                                group
                                w-full
                                flex
                                items-center
                                gap-2.5
                                px-3
                                py-2
                                rounded-xl
                                text-zinc-700
                                dark:text-zinc-300
                                hover:bg-indigo-50
                                dark:hover:bg-zinc-900
                                transition
                            "
            >
              <ChevronRight
                size={14}
                className={`
                                    text-zinc-400
                                    transition-transform
                                    ${
                                      expandedProjects.has(project.id)
                                        ? "rotate-90"
                                        : ""
                                    }
                                `}
              />

              <FolderKanban
                size={15}
                className="
                                    text-indigo-500
                                "
              />

              <span
                className="
                                text-sm
                                truncate
                                flex-1
                                text-left
                            "
              >
                {project.name}
              </span>

              <Link
                onClick={(e) => e.stopPropagation()}
                to={`/projectsDetail?id=${project.id}&tab=settings`}
                className="
                                    opacity-0
                                    group-hover:opacity-100
                                    transition
                                "
              >
                <Settings
                  size={13}
                  className="
                                        text-zinc-400
                                        hover:text-indigo-500
                                    "
                />
              </Link>
            </button>

            {/* Sub Items */}
            {expandedProjects.has(project.id) && (
              <div
                className="
                                    ml-9
                                    mt-1
                                    space-y-1
                                    border-l
                                    border-zinc-200
                                    dark:border-zinc-800
                                    pl-3
                                "
              >
                {getProjectSubItems(project.id).map((subItem) => {
                  const isActive =
                    location.pathname === "/projectsDetail" &&
                    searchParams.get("id") === project.id &&
                    searchParams.get("tab") === subItem.title.toLowerCase();

                  return (
                    <Link
                      key={subItem.title}
                      to={subItem.url}
                      className={`
                                                        flex
                                                        items-center
                                                        gap-2
                                                        px-3
                                                        py-1.5
                                                        rounded-lg
                                                        text-xs
                                                        transition

                                                        ${
                                                          isActive
                                                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                                                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900"
                                                        }
                                                    `}
                    >
                      <subItem.icon size={13} />

                      {subItem.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSidebar;
