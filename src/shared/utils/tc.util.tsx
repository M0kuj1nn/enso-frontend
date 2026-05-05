import { ElementType } from 'react'

import { Props } from '@shared/types'

import { TC } from './ve.util'

export const TComponent = <T extends ElementType>({
  as: Component,
  ...props
}: { as: T } & Omit<Props<T>, 'as'>) => <Component {...(props as Props<T>)} />

export const tc =
  <D extends ElementType>(component: D) =>
  <T extends ElementType = D>({
    as: Component = component as unknown as T,
    ...props
  }: { as?: T } & Omit<Props<TC<T, D>>, 'as'>) => (
    <Component {...(props as Props<T>)} />
  )
