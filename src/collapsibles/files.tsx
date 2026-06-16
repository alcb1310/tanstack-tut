import { Link } from "@tanstack/react-router"
import { ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { FileType } from "@/types/proyectos"

type FilesCollapsibleProps = {
	data: FileType
}

export function FilesCollapsible({ data }: FilesCollapsibleProps) {
	return (
		<Collapsible className='w-full'>
			<CollapsibleTrigger asChild>
				<Button variant='ghost' className='w-full justify-between'>
					{data.key}
					<ChevronRightIcon className='transition-transform group-data-[state=open]:rotate-90' />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				{data.data.map(item => (
					<p key={item.file_url} className='text-sm'>
						<Link to={item.file_url} target='_blank'>
							{item.file_name}
						</Link>
					</p>
				))}
			</CollapsibleContent>
		</Collapsible>
	)
}
