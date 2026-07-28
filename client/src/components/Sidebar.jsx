import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import MyTasksSidebar from "./MyTasksSidebar";
import ProjectSidebar from "./ProjectsSidebar";
import WorkspaceDropdown from "./WorkspaceDropdown";

import {
  LayoutDashboard,
  FolderKanban, // ✅ better for projects
  Users,
  Settings,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Team", href: "/team", icon: Users },
  ];

  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSidebarOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`z-10 min-w-68 flex flex-col h-screen border-r border-[#e7e4ed] bg-[#fdfdfe] dark:border-zinc-800 dark:bg-black max-sm:absolute transition-all ${isSidebarOpen ? "left-0 shadow-xl" : "-left-full"} sm:sticky sm:top-0 sm:left-0`}
    >
      <WorkspaceDropdown />
      <hr className="border-[#e7e4ed] dark:border-zinc-800" />

      <div className="flex-1 overflow-y-scroll no-scrollbar flex flex-col">
        <div>
          <div className="p-4 pt-5">
            <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
              Menu
            </p>

            {menuItems.map((item) => (
              <NavLink
                to={item.href}
                key={item.name}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-4 text-gray-800 dark:text-zinc-100 cursor-pointer rounded-lg transition-all ${
                    isActive
                      ? "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200"
                      : "hover:bg-violet-50 dark:hover:bg-[#24212d]"
                  }`
                }
              >
                <item.icon size={16} />
                <p className="text-sm truncate">{item.name}</p>
              </NavLink>
            ))}

            <button className="flex w-full items-center gap-3 py-2.5 px-4 text-gray-800 dark:text-zinc-100 cursor-pointer rounded-lg hover:bg-violet-50 dark:hover:bg-[#24212d] transition-all">
              <Settings size={16} />
              <p className="text-sm truncate">Settings</p>
            </button>
          </div>

          {/* ✅ ORDER FIXED */}
          <ProjectSidebar />
          <MyTasksSidebar />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
