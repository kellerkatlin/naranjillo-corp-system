"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReproduccionFormData {
  padreCodigo: string;
  padreCategoria: string;
  padreEdad: number;
  padrePeso: number;

  madreCodigo: string;
  madreCategoria: string;
  madreEdad: number;
  madrePeso: number;

  fechaApareamiento: string;
  fechaParto: string;

  criasNacidas: number;
  criasVivas: number;
  criasMuertas: number;
}

export default function FormReproduccion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReproduccionFormData>();

  const onSubmit = (data: ReproduccionFormData) => {
    console.log("Reproducción registrada:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" p-6 rounded max-w-4xl w-full mx-auto"
    >
      <fieldset className="mb-4">
        <legend className="font-bold text-gray-700 mb-2">
          Datos del padre
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Código"
            {...register("padreCodigo", { required: true })}
          />
          <Input
            placeholder="Categoría"
            {...register("padreCategoria", { required: true })}
          />
          <Input
            type="number"
            placeholder="Edad (semanas)"
            {...register("padreEdad", { required: true })}
          />
          <Input
            type="number"
            placeholder="Peso (kg)"
            step="0.1"
            {...register("padrePeso", { required: true })}
          />
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="font-bold text-gray-700 mb-2">
          Datos de la madre
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Código"
            {...register("madreCodigo", { required: true })}
          />
          <Input
            placeholder="Categoría"
            {...register("madreCategoria", { required: true })}
          />
          <Input
            type="number"
            placeholder="Edad (semanas)"
            {...register("madreEdad", { required: true })}
          />
          <Input
            type="number"
            placeholder="Peso (kg)"
            step="0.1"
            {...register("madrePeso", { required: true })}
          />
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="font-bold text-gray-700 mb-2">
          Datos de la reproducción
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            placeholder="Fecha de apareamiento"
            {...register("fechaApareamiento", { required: true })}
          />
          <Input
            type="date"
            placeholder="Fecha de parto"
            {...register("fechaParto", { required: true })}
          />
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="font-bold text-gray-700 mb-2">
          Datos de las crías
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            placeholder="Número de crías nacidas"
            {...register("criasNacidas", { required: true })}
          />
          <Input
            type="number"
            placeholder="Crías vivas"
            {...register("criasVivas", { required: true })}
          />
          <Input
            type="number"
            placeholder="Crías muertas"
            {...register("criasMuertas", { required: true })}
          />
        </div>
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          type="submit"
          className="bg-primary col-span-2 col-end-4 hover:bg-orange-400"
        >
          Registrar
        </Button>
      </div>
    </form>
  );
}
