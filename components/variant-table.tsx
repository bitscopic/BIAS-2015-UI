"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Evidence, Variant } from "../types/variants";
import { ACMGDialog } from "./acmg-dialog";

interface VariantTableProps {
  variants: Variant[];
  onVariantUpdate: (variant: Variant) => void;
}

export function VariantTable({ variants, onVariantUpdate }: VariantTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Variant>[] = [
    {
      accessorKey: "geneName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Gene
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium w-24 truncate">
          {row.getValue("geneName")}
        </div>
      ),
    },
    {
      accessorKey: "hgvsc",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            c.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const notation =
          (row.getValue("hgvsc") as string).split(":")[1] ||
          row.getValue("hgvsc");
        return <div className="w-32 truncate">{notation}</div>;
      },
    },
    {
      accessorKey: "hgvsp",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            p.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const notation =
          (row.getValue("hgvsp") as string).split(":")[1] ||
          row.getValue("hgvsp");
        return <div className="w-32 truncate">{notation}</div>;
      },
    },
    {
      accessorKey: "consequence",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Consequence
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-32 truncate">{row.getValue("consequence")}</div>
      ),
    },
    {
      accessorKey: "acmgClassification",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Classification
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const classification = row.getValue("acmgClassification") as string;
        return (
          <div className="w-32">
            <div
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                classification === "benign"
                  ? "bg-green-100 text-green-800"
                  : classification === "likely benign"
                  ? "bg-blue-100 text-blue-800"
                  : classification === "uncertain significance"
                  ? "bg-yellow-400 text-yellow-900"
                  : classification === "likely pathogenic"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {classification}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "rationale",
      header: "ACMG Rationale",
      cell: ({ row }) => {
        const rationale = row.getValue("rationale") as Variant["rationale"];
        const populatedCriteria = Object.entries(rationale).reduce(
          (acc, [, criteria]: [string, Evidence]) => {
            const activeCriteria = Object.entries(criteria).filter(
              ([, [score]]) => score > 0
            );
            if (activeCriteria.length > 0) {
              acc.push(
                ...activeCriteria.map(([code, [, description]]) => {
                  const match = description.match(
                    /^([A-Z]+\d+(?:_(?:supporting|stand-alone)):)/
                  );
                  const displayCode = match
                    ? match[1].slice(0, -1)
                    : code.toUpperCase();
                  return {
                    code: displayCode,
                    description: description,
                  };
                })
              );
            }
            return acc;
          },
          [] as Array<{ code: string; description: string }>
        );

        return populatedCriteria.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            <TooltipProvider>
              {populatedCriteria.map(({ code, description }) => (
                <Tooltip key={code}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium cursor-help">
                      {code}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">No criteria</span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const variant = row.original;

        return (
          <div className="w-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <ACMGDialog variant={variant} onSave={onVariantUpdate}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Modify ACMG Details
                  </DropdownMenuItem>
                </ACMGDialog>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Copy Variant ID</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: variants,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter genes..."
          value={
            (table.getColumn("geneName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("geneName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

