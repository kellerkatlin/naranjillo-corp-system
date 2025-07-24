import { CuyPadre } from "@/types/cuy";
import { VentasRequest } from "@/types/ventas";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

type Props = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly carrito: { cuy: CuyPadre; precioVenta: number }[];
  readonly onSubmit: (venta: VentasRequest) => void;
};

export default function DialogFinalizarVenta({
  open,
  onClose,
  carrito,
  onSubmit,
}: Props) {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const cantidad = carrito.length;
  const total = carrito.reduce((sum, item) => sum + item.precioVenta, 0);
  const ids = carrito.map((item) => item.cuy.id);

  useEffect(() => {
    if (open) {
      setDni("");
      setNombre("");
      setDireccion("");
      setDescripcion("");
    }
  }, [open]);

  const handleFinalizar = () => {
    if (!dni || !nombre || !direccion) return;

    const venta: VentasRequest = {
      cuyes: carrito.map((item) => ({
        id: item.cuy.id,
        precio: item.precioVenta,
      })),
      precioTotal: total,
      cantidadCuy: cantidad,
      documento: dni,
      nombreRazonSocial: nombre,
      direccion,
      descripcion,
    };

    onSubmit(venta);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Realizar Venta</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="font-medium">Id:</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {ids.map((id) => (
                <span
                  key={id}
                  className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm"
                >
                  {id}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span>
              <strong>Cantidad:</strong> {cantidad}
            </span>
            <span>
              <strong>P. Venta:</strong> S/ {total.toFixed(2)}
            </span>
          </div>

          <div className="grid gap-2 mt-2">
            <Input
              placeholder="DNI / RUC"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            <Input
              placeholder="Nombre / R. Social"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Input
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            <Textarea
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="mt-4 text-right">
            <Button
              className="bg-orange-600 text-white"
              onClick={handleFinalizar}
            >
              Finalizar venta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
