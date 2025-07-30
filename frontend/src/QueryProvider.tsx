import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './queryClient'

type Props = {
  children: React.ReactNode
}

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  return (clientQueryClientSingleton ??= createQueryClient())
}

export function QueryProvider({ children }: Props): React.ReactElement {
  const queryClient = getQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
