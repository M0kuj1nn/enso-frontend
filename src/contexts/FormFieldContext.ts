'use client'

import { createContext, useContext } from 'react'

type FormFieldContextProps = {
  name: string
}

const FormFieldContext = createContext<FormFieldContextProps | undefined>(undefined)

export const useFormFieldContext = () => {
  const context = useContext(FormFieldContext)
  if (!context) {
    throw new Error('useFormFieldContext must be used within a FormField component')
  }
  return context
}

export { FormFieldContext }
