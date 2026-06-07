import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { FormButton } from "@/components/forms/form-button"

export const { fieldContext, formContext, useFormContext, useFieldContext } =
	createFormHookContexts()

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {},
	formComponents: { FormButton },
})
