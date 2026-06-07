import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { AppSidebar } from "@/components/layout/app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"

const readCookieFn = createServerFn({ method: "GET" }).handler(async () => {
	const cookieValue = getCookie("BCA-TOKEN")

	if (!cookieValue) {
		return { cookieValue: null }
	}
	return { cookieValue }
})

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
	loader: async () => {
		const token = await readCookieFn()
		if (!token.cookieValue) {
			throw redirect({ to: "/login" })
		}

		return { cookieValue: token }
	},
})

function RouteComponent() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
					<SidebarTrigger className='-ml-1' />
					<h1 className='text-xl text-primary font-bold'>
						Sistema Control Presupuestario
					</h1>
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4'>
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
