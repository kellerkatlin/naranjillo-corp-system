import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { VentasResponse } from "@/types/ventas";

type Props = {
  open: boolean;
  onClose: () => void;
  venta: VentasResponse | null;
};

export default function DialogDetalleVenta({ open, onClose, venta }: Props) {
  if (!venta) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle de venta #{venta.id}</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Sexo</th>
                <th className="px-4 py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalleVentas?.map((detalle) => (
                <tr key={detalle.id} className="border-b">
                  <td className="px-4 py-2">{detalle.cuy.id}</td>
                  <td className="px-4 py-2">{detalle.cuy.sexo}</td>
                  <td className="px-4 py-2">
                    S/ {detalle.cuy.precio?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right mt-4 font-semibold text-sm">
          Total: S/{" "}
          {venta.detalleVentas
            ?.reduce((sum, d) => sum + (d.cuy.precio || 0), 0)
            .toFixed(2)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
