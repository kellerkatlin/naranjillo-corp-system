"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface VentaFormData {
  cantidad: number;
  total: number;
}

export default function FormVentas() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VentaFormData>();

  const onSubmit = (data: VentaFormData) => {
    console.log("Venta registrada:", data);
    // Aquí puedes llamar a tu API para guardar la venta
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded shadow max-w-md w-full mx-auto"
    >
      <h2 className="text-lg font-bold text-gray-700 mb-4">Registrar Venta</h2>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <Label className="mb-1 block">Cantidad</Label>
          <Input
            type="number"
            min={1}
            {...register("cantidad", { required: true })}
            placeholder="Cantidad vendida"
          />
          {errors.cantidad && (
            <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
          )}
        </div>

        <div>
          <Label className="mb-1 block">Total (S/)</Label>
          <Input
            type="number"
            step="0.01"
            min={0}
            {...register("total", { required: true })}
            placeholder="Monto total de la venta"
          />
          {errors.total && (
            <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-primary hover:bg-orange-400">
          Registrar
        </Button>
      </div>
    </form>
  );
}
