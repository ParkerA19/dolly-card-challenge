import type { Transactions } from 'dolly-card-backend'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

type Props = {
  data: Transactions[]
}

const columnHelper = createColumnHelper<Transactions>()

const columns = [
  columnHelper.accessor('merchant.mcc', {
    header: () => 'MCC',
    cell: info => info.getValue()
  }),
  // columnHelper.accessor(row => row.lastName, {
  //   id: 'lastName',
  //   cell: info => <i>{info.getValue()}</i>,
  //   header: () => <span>Last Name</span>,
  // }),
  columnHelper.accessor('merchant.descriptor', {
    header: () => 'Merchant',
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
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
