"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reproduccion, ReproduccionRequest } from "@/types/reproduccion";
import { getAllCuyes } from "@/services/cuyService";
import { Cuy } from "@/types/cuy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ReproduccionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ReproduccionRequest) => void;
  reproduccion?: Reproduccion | null;
}

export default function ReproduccionDialog({
  open,
  onOpenChange,
  onSubmit,
  reproduccion,
}: ReproduccionDialogProps) {
  const [cuyesPadres, setCuyesPadres] = useState<Cuy[]>([]);
  const [cuyesMadres, setCuyesMadres] = useState<Cuy[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReproduccionRequest>();

  useEffect(() => {
    if (open) {
      if (reproduccion) {
        reset(reproduccion);
      } else {
        reset({
          cantidadHijos: 0,
          fechaReproduccion: new Date().toISOString().split("T")[0],
          fechaParto: new Date().toISOString().split("T")[0],
          padre: { id: 0 },
          madre: { id: 0 },
        });
      }
    }
  }, [open, reproduccion, reset]);

  const loadCuyes = async () => {
    try {
      const resPadres = await getAllCuyes();
      const dataPadres = resPadres.filter((cuy) => cuy.sexo === "MACHO");
      setCuyesPadres(dataPadres);
      const resMadres = await getAllCuyes();
      const dataMadres = resMadres.filter((cuy) => cuy.sexo === "HEMBRA");
      setCuyesMadres(dataMadres);
    } catch (error) {
      console.error("Error loading cuyes:", error);
    }
  };

  useEffect(() => {
    loadCuyes();
  }, []);

  const handleFormSubmit = (data: ReproduccionRequest) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {reproduccion ? "Editar reproducción" : "Registrar reproducción"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block mb-1">Cantidad de Hijos</Label>
              <Input
                type="number"
                {...register("cantidadHijos", { required: true })}
              />
              {errors.cantidadHijos && (
                <p className="text-red-500 text-sm mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label className="block mb-1">Fecha de Reproducción</Label>
              <Input
                type="date"
                {...register("fechaReproduccion", { required: true })}
              />
              {errors.fechaReproduccion && (
                <p className="text-red-500 text-sm mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label className="block mb-1">Fecha de Parto</Label>
              <Input
                type="date"
                {...register("fechaParto", { required: true })}
              />
              {errors.fechaParto && (
                <p className="text-red-500 text-sm mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label className="block mb-1">Padre (Macho)</Label>
              <Select
                onValueChange={(value) => {
                  const id = parseInt(value, 10);
                  if (!isNaN(id)) {
                    setValue("padre.id", id);
                  }
                }}
                defaultValue={watch("padre.id")?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un padre" />
                </SelectTrigger>
                <SelectContent>
                  {cuyesPadres.map((cuy) => (
                    <SelectItem key={cuy.id} value={String(cuy.id)}>
                      ID: {cuy.id} - {cuy.categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.padre?.id && (
                <p className="text-red-500 text-sm mt-1">Campo requerido</p>
              )}
            </div>

            <div>
              <Label className="block mb-1">Madre (Hembra)</Label>
              <Select
                onValueChange={(value) => {
                  const id = parseInt(value, 10);
                  if (!isNaN(id)) {
                    setValue("madre.id", id);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una madre" />
                </SelectTrigger>
                <SelectContent>
                  {cuyesMadres.map((cuy) => (
                    <SelectItem key={cuy.id} value={String(cuy.id)}>
                      ID: {cuy.id} - {cuy.categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.madre?.id && (
                <p className="text-red-500 text-sm mt-1">Campo requerido</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-primary cursor-pointer hover:bg-orange-400"
            >
              {reproduccion ? "Actualizar" : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
