import { useInfiniteQuery } from '@tanstack/react-query'
import { client } from '../feathers/feathers'
import { TransactionsTable } from './TransactionsTable'

export function Transactions(): React.ReactElement {
  const { data, error, isLoading } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: async ({ pageParam }) => {
      return await client.service('transactions').genTransactionsFromCardToken({
        cardToken: 'd438125c-5c47-4b4a-bfcc-6da22b8c51a6',
        cursor: pageParam
      })
    },
    initialPageParam: '', // This is required so we have to handle this on the backend
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.nextCursor
    }
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Transactions</h2>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your transactions...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Transactions</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-700 mb-4">We couldn't load your transactions. Please try again.</p>
            <div className="bg-red-100 border border-red-300 rounded-md p-3 mb-6 max-w-md">
              <p className="text-red-800 text-sm font-mono break-words">{error.message}</p>
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const transactions = data?.pages.flatMap(page => page.data) || []

  // TODO: Display the data in a table and adding loading and error states

  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Transactions</h2>
      <TransactionsTable data={transactions} />
    </div>
  )
}
