import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CircleXIcon, EditIcon, SaveIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAppForm } from "@/hooks/app-form"
import { UpdateRubroMaterial } from "@/queries/rubro-material"
import {
	type RubroMaterialType,
	rubroMaterialSchema,
} from "@/types/rubro-material"

type RubroMaterialEditDrawerProps = {
	material_name: string
	material: RubroMaterialType
}

export function RubroMaterialEditDrawer({
	material,
	material_name,
}: RubroMaterialEditDrawerProps) {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)

	const useEditItemMaterialMutation = useMutation({
		mutationFn: UpdateRubroMaterial,
		onSuccess: () => {
			setOpen(false)
			queryClient.invalidateQueries({ queryKey: ["rubros-material"] })
			toast.success("Material actualizado exitosamente")
		},
		onError: error => {
			toast.error(error.message, {
				position: "top-center",
				style: {
					color: "red",
				},
			})
		},
	})

	const form = useAppForm({
		defaultValues: material,
		validators: {
			onSubmit: rubroMaterialSchema,
		},
		onSubmit: data => {
			const newData = {
				item_id: data.value.item_id,
				material_id: data.value.material_id,
				quantity: Number.parseFloat(data.value.quantity.toString()),
			}

			useEditItemMaterialMutation.mutate({ data: newData })
		},
	})

	useEffect(() => {
		if (open) {
			form.reset()
		}
	}, [open, form.reset])

	return (
		<Drawer direction='right' open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant='ghost'>
					<EditIcon size={10} className='text-yellow-600' />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<form
					onSubmit={e => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
				>
					<DrawerHeader>
						<DrawerTitle>Agregar Material</DrawerTitle>
						<DrawerDescription>
							Agrega un nuevo material que compone parte del rubro seleccionado
						</DrawerDescription>
					</DrawerHeader>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<Field>
								<FieldLabel htmlFor={"name"}>Material</FieldLabel>
								<Input name={"name"} value={material_name} disabled />
							</Field>

							<form.AppField name='quantity'>
								{field => (
									<field.TextField
										name='quantity'
										label='Cantidad'
										placeholder='0.00'
										type='number'
										step={0.01}
									/>
								)}
							</form.AppField>
						</FieldSet>
					</FieldGroup>
					<DrawerFooter>
						<div className='flex justify-start items-center space-x-2'>
							<Button type='submit'>
								<SaveIcon size={10} />
								Guardar
							</Button>
							<DrawerClose asChild>
								<Button type='button' variant='secondary'>
									<CircleXIcon size={10} />
									Cancelar
								</Button>
							</DrawerClose>
						</div>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	)
}
