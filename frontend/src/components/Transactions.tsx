import { useInfiniteQuery } from '@tanstack/react-query'
import { client } from '../feathers/feathers'
import { TransactionsTable } from './TransactionsTable'
import React from 'react'

type Status = 'PENDING' | 'VOIDED' | 'SETTLED' | 'DECLINED' | 'EXPIRED'
type Result = 'APPROVED' | 'DECLINED'

export function Transactions(): React.ReactElement {
  const [end, setEnd] = React.useState<Date | undefined>(undefined)
  const [begin, setBegin] = React.useState<Date | undefined>(undefined)
  const [status, setStatus] = React.useState<Status | undefined>(undefined)
  const [result, setResult] = React.useState<Result | undefined>(undefined)

  // What we need is to give a bunch of filter options to the user and pass those filters into the query
  return (
    <div className="w-4/5 min-h-screen flex-col">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Transactions</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-blue-900">Filters</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="begin" className="block text-sm font-medium text-gray-700">
                Begin Date
              </label>
              <input
                id="begin"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={begin?.toISOString().split('T')[0] || ''}
                onChange={e => setBegin(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                id="end"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={end?.toISOString().split('T')[0] || ''}
                onChange={e => setEnd(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={status || ''}
                onChange={e => setStatus(e.target.value ? (e.target.value as Status) : undefined)}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="SETTLED">Settled</option>
                <option value="DECLINED">Declined</option>
                <option value="VOIDED">Voided</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="result" className="block text-sm font-medium text-gray-700">
                Result
              </label>
              <select
                id="result"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={result || ''}
                onChange={e => setResult(e.target.value ? (e.target.value as Result) : undefined)}
              >
                <option value="">All Results</option>
                <option value="APPROVED">Approved</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>
          </div>
          {(begin || end || status || result) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setBegin(undefined)
                  setEnd(undefined)
                  setStatus(undefined)
                  setResult(undefined)
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <TransactionsContent begin={begin} end={end} status={status} result={result} />
    </div>
  )
}

type ContentProps = {
  begin?: Date
  end?: Date

  // These types should be synced from the backend but don't want to figure out imports rn. Maybe if I have time.
  status?: 'PENDING' | 'VOIDED' | 'SETTLED' | 'DECLINED' | 'EXPIRED'
  result?: 'APPROVED' | 'DECLINED'
}

function TransactionsContent({ begin, end, status, result }: ContentProps): React.ReactElement {
  const { data, error, isLoading } = useInfiniteQuery({
    queryKey: ['transactions', begin, end, status, result],
    queryFn: async ({ pageParam }) => {
      return await client.service('transactions').genTransactionsFromCardToken({
        cardToken: 'd438125c-5c47-4b4a-bfcc-6da22b8c51a6',
        cursor: pageParam,
        begin: begin?.toISOString(),
        end: end?.toISOString(),
        status,
        result
      })
    },
    initialPageParam: '', // This is required so we have to handle this on the backend
    getNextPageParam: lastPage => {
      return lastPage.nextCursor
    }
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
    <div className="w-full min-h-screen mx-auto p-6">
      <TransactionsTable data={transactions} />
    </div>
  )
}
