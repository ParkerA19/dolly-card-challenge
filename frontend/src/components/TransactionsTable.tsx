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
    cell: info => info.renderValue()
  }),
  columnHelper.accessor('merchant_currency', {
    header: () => 'Merchant Currency',
    cell: info => info.renderValue()
  }),
  columnHelper.accessor('amount', {
    header: () => 'Amount',
    footer: info => info.column.id
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: info => info.column.id
  }),
  columnHelper.accessor('result', {
    header: 'Profile Progress',
    footer: info => info.column.id
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
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
    </div>
  )
}
