"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alimentacion } from "@/types/alimentacion";
import { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

interface DetalleAlimentacionDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly alimentaciones: Alimentacion[];
  readonly javaNombre: string;
}

export default function DetalleAlimentacionDialog({
  open,
  onOpenChange,
  alimentaciones,
  javaNombre,
}: DetalleAlimentacionDialogProps) {
  const totalCantidad = alimentaciones.reduce(
    (sum, item) => sum + item.cantidad,
    0
  );
  const totalCosto = alimentaciones.reduce((sum, item) => sum + item.costo, 0);

  // Definimos columns pero solo como referencia (usamos para renderizar las columnas dinámicamente)
  const columns: ColumnDef<Alimentacion>[] = [
    {
      accessorKey: "fechaAlimentacion",
      header: "Fecha de Registro",
      cell: ({ row }) => {
        const fechaStr = row.original.fechaAlimentacion;
        const fecha = new Date(fechaStr);

        const dia = fecha.getDate().toString().padStart(2, "0");
        const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const anio = fecha.getFullYear();
        const hora = fecha.getHours().toString().padStart(2, "0");
        const minutos = fecha.getMinutes().toString().padStart(2, "0");

        return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
      },
    },

    { accessorKey: "java.nombre", header: "Java" },
    {
      accessorKey: "tipoAlimento.nombre",
      header: "Nombre de alimento",
      cell: ({ row }) => row.original.tipoAlimento?.nombre || "-",
    },
    { accessorKey: "cantidad", header: "Cantidad" },
    {
      accessorKey: "unidadMedida.nombre",
      header: "U. Medida",
      cell: ({ row }) => row.original.unidadMedida?.nombre || "-",
    },
    {
      accessorKey: "costo",
      header: "Costo",
      cell: ({ row }) => `S/ ${row.original.costo.toFixed(2)}`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalle de {javaNombre}</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <div className="flex items-center justify-center">
                  {columns.map((col, index) => (
                    <TableHead key={index}>
                      {typeof col.header === "string"
                        ? col.header
                        : col.header?.()}
                    </TableHead>
                  ))}
                </div>
              </TableRow>
            </TableHeader>

            <TableBody>
              {alimentaciones.map((item, rowIndex) => (
                <TableRow className="text-center" key={rowIndex}>
                  {columns.map((col, colIndex) => {
                    if (col.cell) {
                      return (
                        <TableCell key={colIndex}>
                          {col.cell({ row: { original: item } } as any)}
                        </TableCell>
                      );
                    } else if (col.accessorKey) {
                      const keys = (col.accessorKey as string).split(".");
                      let value: any = item;
                      keys.forEach((k) => {
                        value = value?.[k];
                      });
                      return (
                        <TableCell key={colIndex}>{value ?? "-"}</TableCell>
                      );
                    } else {
                      return <TableCell key={colIndex}>-</TableCell>;
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow className="font-bold bg-gray-50">
                <TableCell colSpan={3}>TOTAL</TableCell>
                <TableCell>{totalCantidad}</TableCell>
                <TableCell></TableCell>
                <TableCell>S/ {totalCosto.toFixed(2)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
