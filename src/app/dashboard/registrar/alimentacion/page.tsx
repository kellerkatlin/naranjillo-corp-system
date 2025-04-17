"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createAlimentacion } from "@/services/alimentacionService";
import { AlimentacionRequest } from "@/types/alimentacion";

export default function FormAlimentacion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlimentacionRequest>();

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: AlimentacionRequest) => {
    try {
      const response = await createAlimentacion(data);
      console.log("Alimentación registrada:", response);
      alert("Alimentación registrada correctamente");
      window.location.href = "/dashboard/registrar/alimentacion";
    } catch (error) {
      console.error("Error al registrar la alimentación:", error);
      alert("Error al registrar la alimentación. Intente nuevamente.");
    }
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
