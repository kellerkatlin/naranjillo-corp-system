"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alimentacion } from "@/types/alimentacion";
import { Reproduccion } from "@/types/reproduccion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getAllReproducciones } from "@/services/reproduccionService";

interface AlimentacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: Alimentacion) => void;
  alimentacion?: Alimentacion | null;
}

export default function AlimentacionDialog({
  open,
  onOpenChange,
  onSubmit,
  alimentacion,
}: AlimentacionDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Alimentacion>();

  const [reproducciones, setReproducciones] = useState<Reproduccion[]>([]);

  useEffect(() => {
    // Simulate fetching reproducciones data
    const fetchReproducciones = async () => {
      try {
        const response = await getAllReproducciones();
        setReproducciones(response);
      } catch (error) {
        console.error("Error fetching reproducciones:", error);
      }
    };

    fetchReproducciones();
  }, []);

  useEffect(() => {
    if (open) {
      if (alimentacion) {
        const reproduccionId = reproducciones.find(
          (repro) => repro.nombreCuyera === alimentacion.nombreReproduccion
        );
        reset({
          ...alimentacion,
          reproduccion: {
            id: reproduccionId?.id || 0,
          },
        });
      } else {
        reset({
          tipoAlimento: "",
          cantidad: "",
          fechaAlimentacion: new Date().toISOString().split("T")[0],
          nombreReproduccion: "",
          reproduccion: {
            id: 0,
          },
          unidadMedida: "",
        });
      }
    }
  }, [open, alimentacion, reset, reproducciones]);

  const handleFormSubmit = (data: Alimentacion) => {
    console.log("Form submitted with data:", data);
    if (onSubmit) {
      onSubmit(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {alimentacion ? "Editar alimentación" : "Registrar alimentación"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label className="mb-1 block">Tipo de Alimento</Label>
            <Input
              type="text"
              placeholder="Ej: Alfalfa, Concentrado"
              {...register("tipoAlimento", { required: true })}
            />
            {errors.tipoAlimento && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>
          <div>
            <Label className="mb-1 block">Reproducción</Label>
            <Select
              onValueChange={(value) => {
                setValue("reproduccion.id", +value, {
                  shouldValidate: true,
                });
              }}
              value={watch("reproduccion.id")?.toString() || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {reproducciones.find((r) => r.id === watch("reproduccion.id"))
                    ?.nombreCuyera || "Selecciona una reproducción"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {reproducciones.map((reproduccion) => (
                  <SelectItem
                    key={reproduccion.id}
                    value={reproduccion.id.toString()}
                  >
                    {reproduccion.nombreCuyera}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reproduccion?.id && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>
          <div>
            <Label className="mb-1 block">Unidad de Medida</Label>
            <Select
              onValueChange={(value) => {
                setValue("unidadMedida", value, { shouldValidate: true });
              }}
              value={watch("unidadMedida") || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una unidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilogramos</SelectItem>
                <SelectItem value="g">Gramos</SelectItem>
                <SelectItem value="l">Litros</SelectItem>
              </SelectContent>
            </Select>
            {errors.unidadMedida && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>
          <div>
            <Label className="mb-1 block">
              Cantidad{" "}
              {watch("unidadMedida") ? `(${watch("unidadMedida")})` : ""}
            </Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Cantidad suministrada"
              {...register("cantidad", { required: true })}
            />
            {errors.cantidad && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1 block">Fecha de Alimentación</Label>
            <Input
              type="date"
              {...register("fechaAlimentacion", { required: true })}
            />
            {errors.fechaAlimentacion && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-primary cursor-pointer hover:bg-orange-400"
            >
              {alimentacion ? "Actualizar" : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
