"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alimentacion, AlimentacionRequest } from "@/types/alimentacion";
import { getAllJavas } from "@/services/javaService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { JavaRespose } from "@/types/java";
import {
  createTipoAlimento,
  getAllTiposAlimentos,
} from "@/services/tipoAlimentoService";
import { createUnidad, getAllUnidades } from "@/services/unidadMedidaService";
import { toast } from "sonner";

interface AlimentacionDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit?: (data: AlimentacionRequest) => void;
  readonly alimentacion?: Alimentacion | null;
}

interface AlimentacionFormValues {
  cantidad: number;
  costo: number;
  fechaInput: string;
  horaInput: string;
  java: { id: number };
  tipoAlimento: { id: number };
  unidadMedida: { id: number };
}

export default function AlimentacionDialog({
  open,
  onOpenChange,
  onSubmit,
  alimentacion,
}: AlimentacionDialogProps) {
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<AlimentacionFormValues>(); // <== Trabajamos con campos separados

  const [tipoAlimento, setTipoAlimento] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [unidades, setUnidades] = useState<
    { id: number; nombre: string; simbolo: string }[]
  >([]);
  const [javas, setJavas] = useState<JavaRespose[]>([]);

  const [unidadModalOpen, setUnidadModalOpen] = useState(false);
  const [nuevaUnidadNombre, setNuevaUnidadNombre] = useState("");
  const [nuevoSimbolo, setNuevoSimbolo] = useState("");

  const [tipoModalOpen, setTipoModalOpen] = useState(false);
  const [nuevoTipoNombre, setNuevoTipoNombre] = useState("");

  useEffect(() => {
    if (open) {
      Promise.all([getAllJavas(), getAllTiposAlimentos(), getAllUnidades()])
        .then(([javasRes, tiposRes, unidadesRes]) => {
          setJavas(javasRes);
          setTipoAlimento(tiposRes);
          setUnidades(unidadesRes);

          if (alimentacion) {
            const fecha = new Date(alimentacion.fechaAlimentacion);
            const fechaStr = fecha.toISOString().split("T")[0];
            const horaStr = fecha
              .toTimeString()
              .split(":")
              .slice(0, 2)
              .join(":");

            reset({
              cantidad: alimentacion.cantidad,
              fecha,
              fechaInput: fechaStr,
              horaInput: horaStr,
              costo: alimentacion.costo,
              java: { id: alimentacion.java.id },
              tipoAlimento: { id: alimentacion.tipoAlimento.id },
              unidadMedida: { id: alimentacion.unidadMedida.id },
            });
          } else {
            const hoy = new Date();
            reset({
              cantidad: 0,
              fechaInput: hoy.toISOString().split("T")[0],
              horaInput: hoy.toTimeString().slice(0, 5),
              costo: 0,
              java: { id: 0 },
              tipoAlimento: { id: 0 },
              unidadMedida: { id: 0 },
            });
          }
        })
        .catch((err) => console.error("Error cargando catálogos:", err));
    }
  }, [open, alimentacion, reset]);

  const handleFormSubmit = (data: AlimentacionFormValues) => {
    // unir fecha + hora antes de enviar
    const fechaAlimentacion = `${data.fechaInput}T${data.horaInput}:00`;

    const payload: AlimentacionRequest = {
      cantidad: +data.cantidad,
      costo: +data.costo,
      fechaAlimentacion,
      java: { id: data.java.id, nombre: "" },
      tipoAlimento: { id: data.tipoAlimento.id, nombre: "" },
      unidadMedida: { id: data.unidadMedida.id, nombre: "", simbolo: "" },
    };

    if (onSubmit) onSubmit(payload);
    onOpenChange(false);
  };

  const handleAgregarUnidad = async () => {
    try {
      const nueva = await createUnidad({
        nombre: nuevaUnidadNombre,
        simbolo: nuevoSimbolo,
      });

      toast.success("Unidad de medida creada correctamente");
      setUnidades((prev) => [...prev, nueva]);
      setValue("unidadMedida.id", nueva.id, { shouldValidate: true });

      setUnidadModalOpen(false);
      setNuevaUnidadNombre("");
      setNuevoSimbolo("");
    } catch (err) {
      console.error("Error creando unidad de medida:", err);
    }
  };

  const handleAgregarTipoAlimento = async () => {
    try {
      const nuevo = await createTipoAlimento(nuevoTipoNombre);
      toast.success("Tipo de alimento creado correctamente");

      setTipoAlimento((prev) => [...prev, nuevo]);
      setValue("tipoAlimento.id", nuevo.id, { shouldValidate: true });

      setTipoModalOpen(false);
      setNuevoTipoNombre("");
    } catch (err) {
      console.error("Error creando tipo de alimento:", err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {alimentacion ? "Editar alimentación" : "Registrar alimentación"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  {...register("fechaInput", { required: true })}
                />
              </div>

              <div>
                <Label>Hora</Label>
                <Input
                  type="time"
                  {...register("horaInput", { required: true })}
                />
              </div>
            </div>

            <div>
              <Label>Java</Label>
              <Select
                onValueChange={(value) =>
                  setValue("java.id", +value, { shouldValidate: true })
                }
                value={watch("java.id")?.toString() || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una Java" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {javas.map((java) => (
                    <SelectItem key={java.id} value={java.id.toString()}>
                      {java.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo de alimento</Label>
              <div className="flex items-center gap-2">
                <Select
                  onValueChange={(value) =>
                    setValue("tipoAlimento.id", +value, {
                      shouldValidate: true,
                    })
                  }
                  value={watch("tipoAlimento.id")?.toString() || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo de alimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoAlimento.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={() => setTipoModalOpen(true)}>
                  Agregar Tipo Alimento
                </Button>
              </div>
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("cantidad", { required: true })}
                />
              </div>

              <div className="flex-1">
                <Label>Unidad de Medida</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("unidadMedida.id", +value, {
                      shouldValidate: true,
                    })
                  }
                  value={watch("unidadMedida.id")?.toString() || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((unidad) => (
                      <SelectItem key={unidad.id} value={unidad.id.toString()}>
                        {unidad.nombre} ({unidad.simbolo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" onClick={() => setUnidadModalOpen(true)}>
                Agregar Unidad
              </Button>
            </div>

            <div>
              <Label>Costo</Label>
              <Input
                type="number"
                step="0.01"
                {...register("costo", { required: true })}
              />
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

      <Dialog open={unidadModalOpen} onOpenChange={setUnidadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nueva unidad de medida</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={nuevaUnidadNombre}
                onChange={(e) => setNuevaUnidadNombre(e.target.value)}
              />
            </div>

            <div>
              <Label>Simbolo</Label>
              <Input
                value={nuevoSimbolo}
                onChange={(e) => setNuevoSimbolo(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setUnidadModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAgregarUnidad}
                disabled={!nuevaUnidadNombre.trim() || !nuevoSimbolo.trim()}
              >
                Agregar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={tipoModalOpen} onOpenChange={setTipoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nuevo tipo de alimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={nuevoTipoNombre}
                onChange={(e) => setNuevoTipoNombre(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTipoModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleAgregarTipoAlimento}
                disabled={!nuevoTipoNombre.trim()}
              >
                Agregar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
