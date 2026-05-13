'use client'

import { createContext, useContext } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

type FormContextProps = Omit<
  UseFormReturn<FieldValues, unknown, unknown>,
  'handleSubmit'
>

const FormContext = createContext<FormContextProps | undefined>(undefined)

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form component')
  }
  return context
}

export { FormContext }
