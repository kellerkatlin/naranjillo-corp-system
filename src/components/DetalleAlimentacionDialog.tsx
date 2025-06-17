"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alimentacion } from "@/types/alimentacion";

interface DetalleAlimentacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alimentaciones: Alimentacion[];
  javaNombre: string;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalle de {javaNombre}</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th>Fecha</th>
                <th>Java</th>
                <th>Nombre de alimento</th>
                <th>Cantidad</th>
                <th>U. Medida</th>
                <th>Costo</th>
              </tr>
            </thead>
            <tbody>
              {alimentaciones.map((item, index) => (
                <tr key={index} className="border-b">
                  <td>00/00/00</td>{" "}
                  {/* Aquí puedes poner la fecha real si deseas */}
                  <td>{item.java.nombre}</td>
                  <td>{item.tipoAlimento?.nombre || "-"}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.unidadMedida?.nombre || "-"}</td>
                  <td>S/ {item.costo.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={2}>TOTAL</td>
                <td>{javaNombre}</td>
                <td>{totalCantidad}</td>
                <td></td>
                <td>S/ {totalCosto.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
