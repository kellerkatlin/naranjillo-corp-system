"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alimentacion } from "@/types/alimentacion";
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
                <TableHead className="text-center">Fecha de Registro</TableHead>
                <TableHead className="text-center">Java</TableHead>
                <TableHead className="text-center">
                  Nombre de alimento
                </TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-center">U. Medida</TableHead>
                <TableHead className="text-center">Costo</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {alimentaciones.map((item, index) => {
                const fecha = new Date(item.fechaAlimentacion);
                const fechaFormateada = `${fecha
                  .getDate()
                  .toString()
                  .padStart(2, "0")}/${(fecha.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}/${fecha.getFullYear()} ${fecha
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${fecha
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;

                return (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {fechaFormateada}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.java.nombre}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.tipoAlimento?.nombre ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.cantidad}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.unidadMedida?.nombre ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      S/ {item.costo.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
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
