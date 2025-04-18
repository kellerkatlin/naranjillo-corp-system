"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Cuy } from "@/types/cuy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CuyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Cuy, "id">) => void;
  cuy?: Cuy | null;
}

export default function CuyDialog({
  open,
  onOpenChange,
  onSubmit,
  cuy,
}: CuyDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Omit<Cuy, "id">>();

  useEffect(() => {
    if (open) {
      if (cuy) {
        reset(cuy);
      } else {
        reset({
          edad: 0,
          fechaRegistro: new Date().toISOString().split("T")[0],
          categoria: "",
          estado: "",
        });
      }
    }
  }, [open, cuy, reset]);

  const handleFormSubmit = (data: Omit<Cuy, "id">) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {cuy ? `Editar cuy ${cuy.id}` : "Registrar cuy"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 mt-5"
        >
          <div>
            <Label className="mb-1 block">Edad (semanas)</Label>
            <Input
              type="number"
              placeholder="Edad"
              {...register("edad", { required: true })}
            />
            {errors.edad && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1 block">Fecha de Registro</Label>
            <Input
              type="date"
              {...register("fechaRegistro", { required: true })}
            />
            {errors.fechaRegistro && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1 block">Categoría</Label>
            <Input
              type="text"
              placeholder="Ej: Engorde, Reproductor"
              {...register("categoria", { required: true })}
            />
            {errors.categoria && (
              <p className="text-red-500 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1 block">Estado</Label>
            <Select
              onValueChange={(value) => setValue("estado", value)}
              defaultValue={watch("estado")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIVO">VIVO</SelectItem>
                <SelectItem value="MUERTO">MUERTO</SelectItem>
                <SelectItem value="VENDIDO">VENDIDO</SelectItem>
              </SelectContent>
            </Select>
            {errors.estado && (
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
              {cuy ? "Actualizar" : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
