import { useInfiniteQuery } from '@tanstack/react-query'
import { client } from '../feathers/feathers'

export function Transactions(): React.ReactElement {
  const { data, error, isLoading } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: async ({ pageParam }) => {
      return await client
        .service('transactions')
        .genTransactionsFromCardToken({
          cardToken: 'd438125c-5c47-4b4a-bfcc-6da22b8c51a6',
          cursor: pageParam
        })
    },
    initialPageParam: '', // This is required so we have to handle this on the backend
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.nextCursor
    }
  })

  console.log('Transactions data:', data)

  // TODO: Display the data in a table and adding loading and error states

  return (
    <div>
      <h2>Transactions Component</h2>
      <p>This is where transaction-related content will go.</p>
    </div>
  )
}
