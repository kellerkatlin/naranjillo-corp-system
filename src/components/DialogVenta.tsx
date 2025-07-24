import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CuyPadre } from "@/types/cuy";

type Props = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly cuy: CuyPadre | null;
  readonly onSubmit: (item: { cuy: CuyPadre; precioVenta: number }) => void;
};

export default function DialogVenta({ open, onClose, cuy, onSubmit }: Props) {
  const [precio, setPrecio] = useState("");
  useEffect(() => {
    if (open) setPrecio("");
  }, [open]);

  const handleSubmit = () => {
    if (cuy && precio) {
      onSubmit({
        cuy,
        precioVenta: parseFloat(precio),
      });
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar</DialogTitle>
        </DialogHeader>

        <div>
          <label className="block text-sm font-medium mb-1">Precio S/</label>
          <Input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleSubmit}
          >
            Agregar al carrito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
