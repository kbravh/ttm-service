import { FC, ReactNode } from "react"
import { useHasMounted } from "../hooks/useHasMounted"

interface Props {
  children: ReactNode
}

export const ClientOnly: FC<Props> = ({children}) => {
  const hasMounted = useHasMounted()

  if (!hasMounted) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}
