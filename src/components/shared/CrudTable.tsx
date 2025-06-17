"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CrudTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  totalColumns?: string[]; // Las columnas que quieres sumar
}

export function CrudTable<TData extends Record<string, any>>({
  columns,
  data,
  totalColumns = [], // por defecto vacío si no se pasan columnas a sumar
}: CrudTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  // Calcular los totales (solo si totalColumns tiene algo)
  const totals = totalColumns.reduce((acc, key) => {
    const sum = data.reduce((s, row) => {
      const keys = key.split(".");
      let value: any = row;
      keys.forEach((k) => (value = value?.[k]));
      return s + (typeof value === "number" ? value : 0);
    }, 0);
    acc[key] = sum;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className="rounded-md border overflow-x-auto w-full">
        <Table className="min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead className="text-center" key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center" key={cell.id}>
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
                <TableCell colSpan={columns.length} className="text-center">
                  No hay datos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {totalColumns.length > 0 && (
            <TableFooter>
              <TableRow className="font-bold bg-gray-50">
                {columns.map((col, index) => {
                  if (index === 0) {
                    return <TableCell key={index}>TOTAL</TableCell>;
                  }

                  const accessor = col.accessorKey as string;
                  if (totalColumns.includes(accessor)) {
                    return (
                      <TableCell key={index}>
                        {totals[accessor].toLocaleString("es-PE", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    );
                  }

                  return <TableCell key={index}></TableCell>;
                })}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      <div className="flex justify-end space-x-2 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Filas:</span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </>
  );
}
