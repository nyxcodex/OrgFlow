import { SearchIcon, PanelLeft, Command } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/themeSlice'
import { MoonIcon, SunIcon } from 'lucide-react'
import { UserButton } from '@clerk/react'

const Navbar = ({ setIsSidebarOpen }) => {

    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);

    return (
        <div className="w-full border-b border-[#e7e4ed] bg-[#fdfdfe]/95 px-5 py-3 backdrop-blur dark:border-zinc-800 dark:bg-black/95 sm:px-7 xl:px-12 flex-shrink-0">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sidebar Trigger */}
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" >
                        <PanelLeft size={20} />
                    </button>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5" />
                        <input
                            type="text"
                            placeholder="Search projects, tasks..."
                            className="app-input pl-9 pr-4 py-2 w-full rounded-lg border text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none transition"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 rounded border border-[#e7e4ed] px-1.5 py-0.5 text-[10px] text-zinc-400 dark:border-[#3a3547]"><Command className="size-2.5" />K</span>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">

                    {/* Theme Toggle */}
                    <button onClick={() => dispatch(toggleTheme())} className="size-9 flex items-center justify-center rounded-lg border border-[#e7e4ed] bg-white text-violet-700 transition hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-violet-300 dark:hover:bg-zinc-800">
                        {
                            theme === "light"
                                ? (<MoonIcon className="size-4 text-gray-800 dark:text-gray-200" />)
                                : (<SunIcon className="size-4 text-yellow-400" />)
                        }
                    </button>

                    {/* User Button */}
                    <UserButton/>
                </div>
            </div>
        </div>
    )
}

export default Navbar
