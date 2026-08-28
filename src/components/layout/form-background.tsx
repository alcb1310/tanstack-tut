import type { ReactNode } from 'react'

export function FormBackground({ children }: { children: ReactNode }) {
	return (
		<div className='md:w-1/2 md:mx-auto my-3 p-3 bg-sidebar-primary-foreground '>
			{children}
		</div>
	)
}
