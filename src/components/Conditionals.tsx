import { FC, ReactNode } from 'react'

interface ConditionalProps {
  condition: boolean
  children: ReactNode
}

//обертка для условного рендера, чтобы не писать {condition && <Component />} в каждом месте, где нужно отрендерить компонент по условию
export const Conditional: FC<ConditionalProps> = ({ condition, children }) => {
  return condition ? <>{children}</> : null
}
