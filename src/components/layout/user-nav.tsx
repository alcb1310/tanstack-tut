import { Link, useNavigate } from "@tanstack/react-router"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { ChevronsUpDown, LogOutIcon } from "lucide-react"
import type { DataType } from "./app-sidebar"
import { createServerFn } from "@tanstack/react-start"
import { deleteCookie } from "@tanstack/react-start/server"

const userData: DataType = {
	title: "User",
	items: [
		{
			title: "Perfil",
			url: "/",
		},
		{
			title: "Administrar",
			url: "/",
		},
	],
}

const logout = createServerFn({ method: "POST" }).handler(async () => {
	deleteCookie("BCA-TOKEN")
})

export function UserNav() {
	const navigate = useNavigate()
	const data = { name: "Andres", email: "7JQJ7@example.com" }

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-primary text-primary-foreground/80'>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate text-xs font-medium'>
									{data?.name}
								</span>
								<span className='truncate text-xs font-extralight'>
									{data?.email}
								</span>
							</div>
							<ChevronsUpDown className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-(--radix-dropdown-menu-trigger-width) min-w-56 '
						side='right'
						align='end'
						sideOffset={4}
					>
						<DropdownMenuGroup>
							{userData.items.map(item => (
								<DropdownMenuItem key={item.title} asChild>
									<Link to={item.url}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								await logout()
								navigate({ to: "/login" })
							}}
						>
							<LogOutIcon />
							Cerrar Session
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
