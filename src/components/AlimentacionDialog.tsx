"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type Alimentacion = {
  id?: number;
  tipoAlimento: string;
  cantidad: string;
  fechaAlimentacion: string;
};

interface AlimentacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Alimentacion) => void;
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
    formState: { errors },
  } = useForm<Alimentacion>();

  useEffect(() => {
    if (open) {
      if (alimentacion) {
        reset(alimentacion);
      } else {
        reset({
          tipoAlimento: "",
          cantidad: "",
          fechaAlimentacion: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [open, alimentacion, reset]);

  const handleFormSubmit = (data: Alimentacion) => {
    onSubmit(data);
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
            <Label className="mb-1 block">Cantidad (kg)</Label>
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
            <Button type="submit" className="bg-primary hover:bg-orange-400">
              {alimentacion ? "Actualizar" : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
