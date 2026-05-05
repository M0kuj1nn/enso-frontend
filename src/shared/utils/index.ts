import { useContext } from 'react'

import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const useContextWrapper = <T>(usingcontext: React.Context<T>) => {
  const context = useContext(usingcontext)
  if (!context)
    throw new Error('Context consumer must be a child of Context provider')
  return context
}
