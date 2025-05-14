"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Sanidad } from "@/types/sanidad";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface SanidadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: Sanidad) => void;
  sanidad?: Sanidad | null;
  readOnly?: boolean;
}

export default function SanidadDialog({
  open,
  onOpenChange,
  onSubmit,
  sanidad,
  readOnly = false,
}: SanidadDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Sanidad>();

  useEffect(() => {
    if (open) {
      if (sanidad) {
        reset(sanidad);
      } else {
        reset({
          tipoMedicina: "",
          incidencia: "",
          comentario: "",
          unidadMedida: "",
          fecha: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [open, sanidad, reset]);

  const handleFormSubmit = (data: Sanidad) => {
    if (onSubmit && !readOnly) {
      onSubmit(data);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {sanidad
              ? readOnly
                ? "Ver registro de sanidad"
                : "Editar sanidad"
              : "Registrar sanidad"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <div>
            <Label className="mb-1 block">Tipo de medicina</Label>
            <Input
              type="text"
              readOnly={readOnly}
              placeholder="Ej: Vacuna, Antibiótico"
              {...register("tipoMedicina", { required: true })}
            />
            {errors.tipoMedicina && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1 block">Incidencia</Label>
            <Input
              type="text"
              readOnly={readOnly}
              placeholder="Ej: Infección, Herida"
              {...register("incidencia", { required: true })}
            />
            {errors.incidencia && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1 block">Comentario</Label>
            <Textarea
              rows={3}
              readOnly={readOnly}
              placeholder="Observaciones del tratamiento o diagnóstico"
              {...register("comentario")}
            />
          </div>

          <div>
            <Label className="mb-1 block">Unidad de medida suministrada</Label>
            <Input
              type="text"
              readOnly={readOnly}
              placeholder="Ej: ml, g, tabletas"
              {...register("unidadMedida", { required: true })}
            />
            {errors.unidadMedida && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1 block">Fecha</Label>
            <Input
              type="date"
              readOnly={readOnly}
              {...register("fecha", { required: true })}
            />
            {errors.fecha && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          {!readOnly && (
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-primary hover:bg-orange-400 cursor-pointer"
              >
                {sanidad ? "Actualizar" : "Registrar"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
