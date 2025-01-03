"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PackageSearch,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface TableDataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TableData<TData, TValue>({
  columns,
  data,
}: TableDataProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [sorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <PackageSearch className="w-6 h-6 text-primary/50" />
        <Input
          placeholder="Filter products by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          className="w-full"
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
        />
      </div>
      <div className="border-primary/20 border rounded-md">
        <Table>
          <TableHeader className="bg-primary/20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- pagination */}

      {data.length > 1 && (
        <div className="flex justify-center items-center gap-4 md:gap-2">
          <div className="flex justify-center items-center gap-2">
            <Button
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              size={"sm"}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronsLeft className="w-4 h-4" />
              <span className="md:block hidden">First</span>
            </Button>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size={"sm"}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="md:block hidden">Previous</span>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p className="bg-secondary px-4 py-2 font-semibold text-sm">
                    {pagination.pageIndex + 1}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Page Number</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size={"sm"}
              variant="outline"
              className="flex items-center gap-2"
            >
              <span className="md:block hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              size={"sm"}
              variant="outline"
              className="flex items-center gap-2"
            >
              <span className="md:block hidden">Last</span>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="p-2 text-sm"
                >
                  {[1, 5, 10, 20, 40].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select maximum number of rows per page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}
