import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { FormButton } from "@/components/forms/form-button"
import { TextField } from "@/components/forms/text-field"

export const { fieldContext, formContext, useFormContext, useFieldContext } =
	createFormHookContexts()

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: { TextField },
	formComponents: { FormButton },
})
