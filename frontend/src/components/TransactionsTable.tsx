import type { Transactions } from 'dolly-card-backend'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
  type GroupingState
} from '@tanstack/react-table'
import { useState } from 'react'

type Props = {
  data: Transactions[]
}

const columnHelper = createColumnHelper<Transactions>()

const columns = [
  columnHelper.accessor('merchant.mcc', {
    header: () => 'MCC',
    cell: info => info.getValue()
  }),
  columnHelper.accessor('merchant.descriptor', {
    header: () => 'Merchant',
    cell: info => <div className="font-medium text-gray-900">{info.renderValue()}</div>
  }),
  columnHelper.accessor('merchant_currency', {
    header: () => 'Currency',
    cell: info => <span className="text-gray-600 font-mono text-sm">{info.renderValue()}</span>
  }),
  columnHelper.accessor('amount', {
    header: () => 'Amount',
    cell: info => (
      <span className="font-semibold text-gray-900">
        {typeof info.getValue() === 'number' ? `$${info.getValue().toFixed(2)}` : info.getValue()}
      </span>
    )
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue() as string
      const statusColors = {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        declined: 'bg-red-100 text-red-800',
        default: 'bg-gray-100 text-gray-800'
      }
      const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.default

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
    header: 'Result'
  })
]

export function TransactionsTable({ data }: Props): React.ReactElement {
  const [grouping, setGrouping] = useState<GroupingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping
    },
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel()
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
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
            {table.getRowModel().rows.map((row, index) => (
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
            ))}
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
