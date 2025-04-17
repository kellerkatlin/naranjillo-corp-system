"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CuyFormData {
  codigo: string;
  fecha: string;
  edad: number;
  sexo: string;
  categoria: string;
  peso: number;
}

export default function RegistrarCuyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CuyFormData>();

  const onSubmit = (data: CuyFormData) => {
    console.log("Cuy registrado:", data);
    // Aquí puedes llamar a tu API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" pl-10 p-6  w-full ">
      <div className="grid md:grid-cols-3 gap-4 items-center mb-4">
        <Label className="col-span-1">Código</Label>
        <Input
          {...register("codigo", { required: true })}
          className="col-span-2"
        />

        <Label className="col-span-1">Fecha</Label>
        <Input
          type="date"
          {...register("fecha", { required: true })}
          className="col-span-2"
        />

        <Label className="col-span-1">Edad</Label>
        <Input
          type="number"
          {...register("edad", { required: true })}
          className="col-span-2"
        />

        <Label className="col-span-1">Sexo</Label>
        <Input
          {...register("sexo", { required: true })}
          className="col-span-2"
        />

        <Label className="col-span-1">Categoría</Label>
        <Input
          {...register("categoria", { required: true })}
          className="col-span-2"
        />

        <Label className="col-span-1">Peso (kg)</Label>
        <Input
          type="number"
          step="0.1"
          {...register("peso", { required: true })}
          className="col-span-2"
        />
        <div className="md:col-span-2 md:col-end-4 col-span-3  ">
          <Button
            type="submit"
            className="bg-primary w-full hover:bg-orange-400"
          >
            Registrar
          </Button>
        </div>
      </div>
    </form>
  );
}
