'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable prettier/prettier */
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Columns3, Download, Filter } from 'lucide-react'
import React, { ReactNode, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import dynamic from 'next/dynamic'
import * as XLSX from 'xlsx'

const DataTablePagination = dynamic(() => import('@/components/pagination'), {
  ssr: false,
})

interface DataTableProps<TData> {
  columns: any
  data: TData[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  pageSize: number
  onChangePageSize: (value: number) => void
  onChangeCurrentPage: (value: number) => void
  customTableHeader?: ReactNode
  isHideFilterButton?: boolean
  isHidePagination?: boolean
}

function DataTableConfig<TData>({
  columns,
  data,
  isLoading,
  onChangeCurrentPage,
  onChangePageSize,
  customTableHeader,
  totalPages,
  pageSize,
  currentPage,
  isHideFilterButton = true,
  isHidePagination = false,
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])


  const getColumnNameStr = (columnID: string) => {
    if (!columns || !columnID) return ''
    let nameStr = columnID
    const filteredColumn = columns?.find(
      ({ id }: { id: string }) => id === columnID,
    )
    if (filteredColumn && filteredColumn?.helperName) {
      nameStr = filteredColumn.helperName
    }
    return nameStr
  }

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'dados');
    XLSX.writeFile(wb, 'dados.xlsx');
  };

  const getHeader = () => {
    try {
      return table?.getHeaderGroups()
    } catch (err) {
      return []
    }
  }

  const getRowModel = () => {
    try {
      return getFilteredRowModel()
    } catch (err) {
      return undefined
    }
  }

  const getColumns = () => {
    try {
      return table?.getAllColumns()?.filter((column) => column?.getCanHide())
    } catch (err) { }
  }

  const getCoreRow = () => {
    try {
      return getCoreRowModel()
    } catch (err) {
      return undefined as any
    }
  }

  const getSortedModel = () => {
    try {
      return getSortedRowModel()
    } catch (err) {
      return undefined as any
    }
  }

  const getRowPaginationModel = () => {
    try {
      return getPaginationRowModel()
    } catch (err) {
      return undefined as any
    }
  }

  const tableGetRowModel = () => {
    try {
      return table?.getRowModel()
    } catch (e) {
      return { rows: [] }
    }
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRow(),
    getSortedRowModel: getSortedModel(),
    getFilteredRowModel: getRowModel(),
    getPaginationRowModel: getRowPaginationModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <>
      <div className="flex gap-2 items-center justify-between flex-col sm:flex-row">
        <div className="flex w-full items-center space-x-0 sm:space-x-2 flex-col sm:flex-row gap-2">
          {customTableHeader ? (
            <>{customTableHeader}</>
          ) : (
            <div className="w-full" />
          )}
          <div className="flex items-center gap-2">
            {!isHideFilterButton && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="ml-auto flex items-center  w-full sm:w-fit"
                    >
                      <Columns3 className="w-4 h-4 mr-2" />
                      Colunas
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {getColumns()?.map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column?.id}
                          className="capitalize"
                          checked={column?.getIsVisible()}
                          onCheckedChange={(value: any) =>
                            column?.toggleVisibility(!!value)
                          }
                        >
                          {getColumnNameStr(column?.id)}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  className="flex items-center w-full sm:w-fit"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center  w-full sm:w-fit"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </>
            )}
          </div>

        </div>
      </div >

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {getHeader()?.map((headerGroup) => (
              <TableRow key={headerGroup?.id}>
                {headerGroup?.headers?.map((header) => {
                  return (
                    <TableHead key={header?.id}>
                      {header?.isPlaceholder
                        ? null
                        : flexRender(
                          header?.column?.columnDef?.header,
                          header?.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns?.length || 1}
                  className="min-h-89 text-center pb-8"
                >
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full mt-4" />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {tableGetRowModel()?.rows?.length ? (
                  tableGetRowModel()?.rows?.map((row) => {

                    const getVisibleCell = () => {
                      try {
                        return row?.getVisibleCells()
                      } catch (e) {
                        return []
                      }
                    }

                    return (
                      <TableRow
                        key={row?.id}
                        data-state={row?.getIsSelected() && 'selected'}
                      >
                        {getVisibleCell()?.map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell?.column?.columnDef?.cell,
                              cell?.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns?.length || 1}
                      className="h-24 text-center"
                    >
                      Sem resultados...
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      {!isHidePagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex items-center">
            {!!table && (
              <DataTablePagination
                table={table as any}
                pageSize={pageSize}
                totalPages={totalPages}
                currentPage={currentPage}
                onChangePageSize={onChangePageSize}
                onChangeCurrentPage={onChangeCurrentPage}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default DataTableConfig