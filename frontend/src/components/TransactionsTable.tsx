import type { Transactions } from 'dolly-card-backend'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
  type ExpandedState,
  type GroupingState,
  type SortingState
} from '@tanstack/react-table'
import { useState } from 'react'

type Props = {
  data: Transactions[]
}

type GroupingColumns = 'mcc' | 'merchant' | 'currency' | 'status' | 'result'

const columnHelper = createColumnHelper<Transactions>()

const columns = [
  columnHelper.accessor('merchant.mcc', {
    id: 'mcc',
    header: () => 'MCC',
    cell: info => info.getValue()
  }),
  columnHelper.accessor('merchant.descriptor', {
    id: 'merchant',
    header: () => 'Merchant',
    cell: info => <div className="font-medium text-gray-900">{info.renderValue()}</div>
  }),
  columnHelper.accessor('merchant_currency', {
    id: 'currency',
    header: () => 'Currency',
    cell: info => <span className="text-gray-600 font-mono text-sm">{info.renderValue()}</span>
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    cell: info => {
      const status = info.getValue() as string
      const statusColors = {
        SETTLED: 'bg-green-100 text-green-800',
        DECLINED: 'bg-red-100 text-red-800',
        PENDING: 'bg-yellow-100 text-yellow-800',
        VOIDED: 'bg-red-100 text-red-800',
        EXPIRED: 'bg-gray-100 text-gray-800'
      }
      const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.PENDING

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
        >
          {status}
        </span>
      )
    }
  }),
  columnHelper.accessor('result', {
    id: 'result',
    header: 'Result',
    cell: info => {
      const status = info.getValue() as string
      const statusColors = {
        APPROVED: 'bg-green-100 text-green-800',
        DECLINED: 'bg-red-100 text-red-800'
      }
      const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.APPROVED

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
        >
          {status}
        </span>
      )
    }
  }),
  columnHelper.accessor('amount', {
    id: 'amount',
    header: () => 'Amount',
    cell: info => (
      <span className="font-semibold text-gray-900">
        {Intl.NumberFormat('en-US', {
          style: 'currency',
          currency:
            // I need to get the current from the other merchant_currency cell in the same row
            info.row.original.merchant_currency || 'USD' // Default to USD if not available
        }).format(typeof info.getValue() === 'number' ? info.getValue() : 0)}
      </span>
    ),

    // P sure these are used for grouping when a cell is aggregated
    aggregationFn: 'sum',
    aggregatedCell: info => (
      <span className="font-semibold text-gray-900">
        {Intl.NumberFormat('en-US', {
          style: 'currency',
          currency:
            // I need to get the current from the other merchant_currency cell in the same row
            info.row.original.merchant_currency || 'USD' // Default to USD if not available
        }).format(typeof info.getValue() === 'number' ? info.getValue() : 0)}
      </span>
    )

    // TODO: Figure out how to add a footer for the total amount. Nice to have but not critical
    // this doesnt actually make much sense since currencies are different. There is already a sum when grouping by currency so thats fine.
    // footer: info => (
    //   // Add the total sum here
    //   <span className="font-semibold text-gray-900">
    //     {info.column.getFilteredRows().reduce((sum, row) => sum + (row.getValue('amount') || 0), 0).toFixed(2)}
    //   </span>
    // )
  }),
  columnHelper.accessor(_row => 1, {
    id: 'count',
    header: () => <span>Transactions</span>,
    aggregationFn: 'sum',
    cell: info => {
      if (info.row.getIsGrouped()) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {info.row.subRows.length}
          </span>
        )
      }
    }
  })
]

export function TransactionsTable({ data }: Props): React.ReactElement {
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>(true)

  const [sorting, setSorting] = useState<SortingState>([{ id: 'amount', desc: true }])

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
      expanded,
      sorting
    },
    onGroupingChange: setGrouping,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        {/* Lets create some tabs that control the grouping of these elements */}

        <nav className="border-b border-gray-200 bg-gray-50">
          <div className="px-4">
            <ul className="flex space-x-8">
              <li>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    grouping.length === 0
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setGrouping([])}
                >
                  All Transactions
                </button>
              </li>
              {(['mcc', 'merchant', 'currency', 'status', 'result'] as GroupingColumns[]).map(column => (
                <li key={column}>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      grouping.includes(column)
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setGrouping([column])}
                  >
                    Group by {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <table className="w-full">
          <thead className="bg-blue-50 border-b border-blue-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map((row, index) => {
              if (row.getIsGrouped()) {
                // lets display the grouped row to make it expandable and show it as a different style
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-blue-25 transition-colors duration-150 bg-slate-300`}
                    onClick={() => row.toggleExpanded()}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              }

              return (
                <tr
                  key={row.id}
                  className={`hover:bg-blue-25 transition-colors duration-150 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
          {table.getFooterGroups().length > 0 && (
            <tfoot className="bg-blue-50 border-t border-blue-100">
              {table.getFooterGroups().map(footerGroup => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
