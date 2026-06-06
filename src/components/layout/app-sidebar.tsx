import { Link } from "@tanstack/react-router"
import {
	ChartCandlestickIcon,
	ChevronRightIcon,
	ReceiptTextIcon,
	ShoppingCartIcon,
	type LucideProps,
} from "lucide-react"
import type {
	ComponentProps,
	ForwardRefExoticComponent,
	RefAttributes,
} from "react"
import type { FileRoutesByTo } from "@/routeTree.gen"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "../ui/sidebar"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible"

type ItemsType = {
	title: string
	url: keyof FileRoutesByTo
	icon?: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>
}

type DataType = {
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
		</Sidebar>
	)
}
