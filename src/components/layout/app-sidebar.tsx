import { Link } from "@tanstack/react-router"
import {
	BanknoteArrowDownIcon,
	BrickWallIcon,
	CableIcon,
	ChartBarStackedIcon,
	ChartCandlestickIcon,
	ChartSplineIcon,
	ChevronRightIcon,
	ClipboardClockIcon,
	FolderKanbanIcon,
	FolderOpenIcon,
	LayoutListIcon,
	type LucideProps,
	ReceiptTextIcon,
	ScaleIcon,
	ShellIcon,
	ShoppingBasketIcon,
	ShoppingCartIcon,
} from "lucide-react"
import type {
	ComponentProps,
	ForwardRefExoticComponent,
	RefAttributes,
} from "react"
import type { FileRoutesByTo } from "@/routeTree.gen"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "../ui/sidebar"
import { UserNav } from "./user-nav"

type ItemsType = {
	title: string
	url: keyof FileRoutesByTo
	icon?: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>
}

export type DataType = {
	title: string
	items: ItemsType[]
}

const menuData: DataType[] = [
	{
		title: "Transacciones",
		items: [
			{
				title: "Presupuesto",
				url: "/transacciones/presupuesto",
				icon: ShoppingCartIcon,
			},
			{
				title: "Facturas",
				url: "/transacciones/factura",
				icon: ReceiptTextIcon,
			},
			{
				title: "Cierre mensual",
				url: "/transacciones/cierre",
				icon: ChartCandlestickIcon,
			},
		],
	},
	{
		title: "Reportes",
		items: [
			{
				title: "Actual",
				url: "/reportes/actual",
				icon: FolderOpenIcon,
			},
			{
				title: "Cuadre",
				url: "/reportes/cuadre",
				icon: ScaleIcon,
			},
			{
				title: "Gastado por Partida",
				url: "/reportes/gastado-por-partida",
				icon: BanknoteArrowDownIcon,
			},
			{
				title: "Histórico",
				url: "/reportes/historico",
				icon: ClipboardClockIcon,
			},
		],
	},
	{
		title: "Parámetros",
		items: [
			{
				title: "Categorias",
				url: "/parametros/categorias",
				icon: ChartBarStackedIcon,
			},
			{
				title: "Materiales",
				url: "/parametros/materiales",
				icon: BrickWallIcon,
			},
			{
				title: "Partidas",
				url: "/parametros/partidas",
				icon: LayoutListIcon,
			},
			{
				title: "Proveedores",
				url: "/parametros/proveedores",
				icon: CableIcon,
			},
			{
				title: "Proyectos",
				url: "/parametros/proyectos",
				icon: FolderKanbanIcon,
			},
			{
				title: "Rubros",
				url: "/parametros/rubros",
				icon: ShoppingBasketIcon,
			},
		],
	},
	{
		title: "Analisis",
		items: [
			{
				title: "Cantidades",
				url: "/analisis/cantidades",
				icon: ShellIcon,
			},
			{
				title: "Analisis",
				url: "/analisis/analisis",
				icon: ChartSplineIcon,
			},
		],
	},
]

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<Link to='/'>
					<p className='w-full text-primary text-center text-xl'>BCA</p>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{menuData.map(items => (
							<Collapsible
								asChild
								key={items.title}
								defaultOpen
								className='group/collapsible'
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton
											tooltip={items.title}
											size='sm'
											className='bg-primary text-primary-foreground'
										>
											<span>{items.title}</span>
											<ChevronRightIcon className='ml-auto transition-transform duration-200 group-data-/collapsible:rotate-90' />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{items.items.map(item => (
												<SidebarMenuSubItem key={item.title}>
													<SidebarMenuSubButton asChild>
														<Link to={item.url}>
															{item.icon && <item.icon />}
															<span>{item.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<UserNav />
			</SidebarFooter>
		</Sidebar>
	)
}
