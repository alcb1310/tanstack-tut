import { createFileRoute, Outlet } from "@tanstack/react-router"
import { AppSidebar } from "@/components/layout/app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
					<SidebarTrigger className='-ml-1' />
					<h1 className='text-xl font-bold'>Sistema Control Presupuestario</h1>
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4'>
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
