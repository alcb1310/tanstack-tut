import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import PageTitle from "@/components/layout/page-title"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { CierreDialog } from "@/drawers/cierre/cierre-dialog"
import { GetAllProjects } from "@/queries/proyectos"

export const Route = createFileRoute("/_authed/transacciones/cierre")({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.query({
			queryKey: ["proyectos", "active"],
			queryFn: () => GetAllProjects({ data: { active: true } }),
		})
	},
})

function RouteComponent() {
	const [project, setProject] = useState("")
	const [fecha, setFecha] = useState("")
	const { data: projects } = useSuspenseQuery({
		queryKey: ["proyectos", "active"],
		queryFn: () => GetAllProjects({ data: { active: true } }),
	})

	const proyValues =
		projects?.map(item => ({
			label: item.name,
			value: item.id as string,
		})) || []
	proyValues.unshift({
		label: "Seleccione un proyecto",
		value: "",
	})

	return (
		<div>
			<PageTitle title='Cierre del Mes' />

			<div className='w-1/2 mx-auto my-3 p-3 bg-sidebar-primary-foreground '>
				<FieldGroup>
					<FieldSet>
						<NativeSelect
							className='w-full'
							name={"proyectos"}
							size='default'
							value={project}
							onChange={e => {
								setProject(e.target.value)
							}}
						>
							{proyValues.map(option => (
								<NativeSelectOption key={option.value} value={option.value}>
									{option.label}
								</NativeSelectOption>
							))}
						</NativeSelect>

						<div className='flex justify-start gap-24'>
							<Input
								className='w-3/12'
								type='date'
								value={fecha}
								onChange={e => setFecha(e.target.value)}
							/>
						</div>

						<CierreDialog projectId={project} date={fecha} />
					</FieldSet>
				</FieldGroup>
			</div>
		</div>
	)
}
