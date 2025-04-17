"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AlimentacionFormData {
  tipoAlimento: string;
  cantidad: number;
  fechaAlimentacion: string;
}

export default function FormAlimentacion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlimentacionFormData>();

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = (data: AlimentacionFormData) => {
    console.log("Alimentación registrada:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" p-6 rounded  max-w-md w-full mx-auto"
    >
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <Label className="mb-1 block">Tipo de Alimento</Label>
          <Input
            type="text"
            placeholder="Ej: Alfalfa, Concentrado"
            {...register("tipoAlimento", { required: true })}
          />
          {errors.tipoAlimento && (
            <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
          )}
        </div>

        <div>
          <Label className="mb-1 block">Cantidad (kg)</Label>
          <Input
            type="number"
            step="0.1"
            placeholder="Cantidad suministrada"
            {...register("cantidad", { required: true })}
          />
          {errors.cantidad && (
            <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
          )}
        </div>

        <div>
          <Label className="mb-1 block">Fecha de Alimentación</Label>
          <Input
            defaultValue={today}
            type="date"
            {...register("fechaAlimentacion", { required: true })}
          />
          {errors.fechaAlimentacion && (
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
