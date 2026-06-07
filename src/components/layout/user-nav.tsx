import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { deleteCookie } from "@tanstack/react-start/server"
import { ChevronsUpDown, LogOutIcon } from "lucide-react"
import { UserChangePasswordDialog } from "@/drawers/usuarios/cambiar-contrasena"
import { MeQuery } from "@/queries/user"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import type { DataType } from "./app-sidebar"

const userData: DataType = {
	title: "User",
	items: [
		{
			title: "Perfil",
			url: "/usuarios/perfil",
		},
		{
			title: "Administrar",
			url: "/usuarios/admin",
		},
	],
}

const logout = createServerFn({ method: "POST" }).handler(async () => {
	deleteCookie("BCA-TOKEN")
})

export function UserNav() {
	const navigate = useNavigate()
	const { data } = useQuery({
		queryKey: ["me"],
		queryFn: () => MeQuery(),
		staleTime: 1000 * 60 * 10, // 10 minutes
	})

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

							<UserChangePasswordDialog />
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
