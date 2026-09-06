import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadTheme } from '../features/themeSlice'
import { Loader2Icon } from 'lucide-react'
import { useUser, SignIn, useAuth, CreateOrganization } from '@clerk/react'
import { fetchWorkspaces } from "../features/workspaceSlice";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { loading, workspaces } = useSelector((state) => state.workspace)
    const dispatch = useDispatch()
    const {user, isLoaded} = useUser()
    const {getToken, orgId} = useAuth()

    // Initial load of theme
    useEffect(() => {
        dispatch(loadTheme())
    }, [])

    // Load workspaces on sign-in and again when Clerk activates a newly created organization.
    useEffect(() => {
        if (!isLoaded || !user) return

        let retryTimer
        let cancelled = false

        const loadWorkspaces = async (attempt = 0) => {
            const result = await dispatch(fetchWorkspaces({getToken})).unwrap()

            // Clerk webhooks are processed asynchronously, so the database may need a
            // moment to receive a just-created organization.
            if (!cancelled && orgId && result.length === 0 && attempt < 4) {
                retryTimer = setTimeout(() => loadWorkspaces(attempt + 1), 1000)
            }
        }

        loadWorkspaces()

        return () => {
            cancelled = true
            clearTimeout(retryTimer)
        }
    }, [dispatch, getToken, isLoaded, orgId, user?.id])

    if(!user){
        return(
            <div className='flex justify-center items-center h-screen bg-white dark:bg-zinc-950'>
                <SignIn/>
            </div>
        )
    }

    if (loading) return (
        <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
            <Loader2Icon className="size-7 text-blue-500 animate-spin" />
        </div>
    )

    if(user && workspaces.length===0){
        return(
            <div className='min-h-screen flex justify-center items-center'>
                <CreateOrganization />
            </div>
        )
    }

    return (
        <div className="app-surface flex min-h-screen">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 h-full overflow-y-auto p-5 sm:p-7 xl:px-12 xl:py-9">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout
