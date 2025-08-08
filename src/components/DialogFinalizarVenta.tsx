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

const METODOS: Array<{
  id: VentasRequest["medioPago"];
  label: string;
  color: string;
  colorActivo: string;
}> = [
  {
    id: "YAPE",
    label: "YAPE",
    color: "border-purple-500 text-purple-500",
    colorActivo: "bg-purple-500 text-white",
  },
  {
    id: "PLIN",
    label: "PLIN",
    color: "border-emerald-500 text-emerald-500",
    colorActivo: "bg-emerald-500 text-white",
  },
  {
    id: "EFECTIVO",
    label: "EFECTIVO",
    color: "border-[#cfce3c] text-[#cfce3c]",
    colorActivo: "bg-[#cfce3c] text-white",
  },
];
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
  const [medioDePago, setMedioDePago] = useState<
    VentasRequest["medioPago"] | ""
  >(""); // 👈 nuevo

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
    if (!dni || !nombre || !direccion || !medioDePago) return;

    const venta: VentasRequest = {
      cuyes: carrito.map((item) => ({
        id: item.cuy.id,
        precio: item.precioVenta,
      })),
      medioPago: medioDePago,
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
  const isFormInvalido = !dni || !nombre || !direccion || !medioDePago;

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
          {/* Métodos de pago */}
          <div className="mt-2">
            <label className="font-medium">Método de pago:</label>
            <div className="mt-2 flex gap-2">
              {METODOS.map(({ id, label, color, colorActivo }) => {
                const activo = medioDePago === id;
                return (
                  <Button
                    key={id}
                    type="button"
                    variant="outline"
                    className={`border-2 ${activo ? colorActivo : color}`}
                    onClick={() => setMedioDePago(id)}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
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
              disabled={isFormInvalido}
            >
              Finalizar venta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
