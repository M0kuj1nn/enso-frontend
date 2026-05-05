import { ComponentPropsWithRef, ElementType } from 'react'

export type Props<T extends ElementType> = ComponentPropsWithRef<T>

export type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>

export type AnyFunction = (...args: any[]) => any

export type OptionalType<T> = T | undefined | null
