"use client";

import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Sanidad, Sanidades } from "@/types/sanidad";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { getAllJavas } from "@/services/javaService";
import { JavaRespose } from "@/types/java";
import { getSanidadesByCuy } from "@/services/cuyService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface SanidadDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit?: (data: Sanidad) => void;
  readonly cuyId?: number | null;
  readonly readOnly?: boolean;
}

export default function SanidadDialog({
  open,
  onOpenChange,
  onSubmit,
  cuyId,
  readOnly = false,
}: SanidadDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Sanidad>();
  const [javasDisponibles, setJavasDisponibles] = useState<JavaRespose[]>([]);
  const [fecha, setFecha] = useState<string>("");
  const [hora, setHora] = useState<string>("");
  const [sanidades, setSanidades] = useState<Sanidades[]>([]);

  const [selectedJavaId, setSelectedJavaId] = useState<number | null>(null);
  const selectedJava = javasDisponibles.find(
    (java) => java.id === selectedJavaId
  );

  const cuyesDisponibles = selectedJava?.cuyes || [];

  useEffect(() => {
    if (open) {
      if (cuyId) {
        const fetchSanidadCuy = async () => {
          try {
            const res = await getSanidadesByCuy(cuyId);
            setSanidades(res.sanidades);
          } catch {
            toast.error("Error al cargar javas disponibles");
          }
        };

        fetchSanidadCuy();
      }

      const now = new Date();
      setFecha(now.toISOString().split("T")[0]);
      setHora(now.toTimeString().slice(0, 5));
      reset({
        costo: 0,
        incidencia: "",
        cuy: cuyId ? { id: cuyId } : {},
      });
    }
    fetchJavasDisponibles();
  }, [open, reset, cuyId]);

  const handleFormSubmit = (data: Sanidad) => {
    if (!fecha || !hora) {
      toast.error("Fecha y hora son obligatorias");
      return;
    }

    const fechaYHoraCompleta = `${fecha}T${hora}:00`; // formato ISO

    const payload: Sanidad = {
      ...data,
      fechaYHora: fechaYHoraCompleta,
    };

    if (onSubmit && !readOnly) {
      onSubmit(payload);
      onOpenChange(false);
    }
  };

  const fetchJavasDisponibles = async () => {
    try {
      const res = await getAllJavas();
      setJavasDisponibles(res);
    } catch {
      toast.error("Error al cargar javas disponibles");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl md:min-w-4xl  py-10  max-h-[90vh]  overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>{readOnly ? "Ver registro" : "Editar"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off">
          <div className="flex gap-6 flex-col  md:justify-between md:flex-row">
            <div className="space-y-4 flex-1 mt-5">
              <div className="grid grid-cols-12 gap-x-4 gap-y-5 md:grid-cols-12">
                <div className="col-span-12  md:col-span-6">
                  <Label className="mb-1 block">Fecha</Label>
                  <Input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    readOnly={readOnly}
                    required
                  />
                </div>
                <div className="col-span-12  md:col-span-6">
                  <Label className="mb-1 block">Hora</Label>
                  <Input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    readOnly={readOnly}
                    required
                  />
                </div>
                <div className="col-span-12 ">
                  <Label className="mb-1 block">Nombre de medicamento</Label>
                  <Input
                    type="text"
                    readOnly={readOnly}
                    placeholder="Ej: Vacuna, Antibiótico"
                    {...register("nombreMedicamento", { required: true })}
                  />
                  {errors.nombreMedicamento && (
                    <p className="text-red-500 text-sm mt-1">
                      Este campo es requerido
                    </p>
                  )}
                </div>

                <div className="col-span-12 ">
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
                {cuyId === null && (
                  <>
                    <div className="col-span-12 l md:col-span-6">
                      <Label className="mb-1 block">Java</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              const javaId = parseInt(value);
                              setSelectedJavaId(javaId);
                            }}
                            value={selectedJavaId?.toString() || ""}
                            disabled={cuyId !== null}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona una Java" />
                            </SelectTrigger>
                            <SelectContent>
                              {javasDisponibles.map((java) => (
                                <SelectItem
                                  key={java.id}
                                  value={java.id.toString()}
                                >
                                  {java.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 l md:col-span-6">
                      <Label className="mb-1 block">Id Cuy</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Controller
                            name="cuy.id"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                                value={field.value ? String(field.value) : ""}
                                disabled={
                                  readOnly || cuyesDisponibles.length === 0
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecciona un Cuy" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="px-2 py-2 text-sm gap-5 flex font-semibold text-muted-foreground select-none">
                                    <span>ID</span> <span>SEXO</span>
                                  </div>
                                  {cuyesDisponibles.map((cuy) => (
                                    <SelectItem
                                      key={cuy.id}
                                      value={cuy.id.toString()}
                                    >
                                      <div className="flex gap-5">
                                        <span>{cuy.id}</span>
                                        <span>{cuy.sexo}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />

                          {errors.cuy?.id && (
                            <p className="text-red-500 text-sm mt-1">
                              Este campo es requerido
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="col-span-12 l md:col-span-6">
                  <Label className="mb-1 block">Dósis por cuy</Label>
                  <Input
                    type="text"
                    readOnly={readOnly}
                    placeholder="Ej: ml, g, tabletas"
                    {...register("dosis", { required: true })}
                  />
                  {errors.dosis && (
                    <p className="text-red-500 text-sm mt-1">
                      Este campo es requerido
                    </p>
                  )}
                </div>
                <div className="col-span-12 l md:col-span-6">
                  <Label className="mb-1 block">Costo</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    readOnly={readOnly}
                    placeholder="S/."
                    {...register("costo", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.costo && (
                    <p className="text-red-500 text-sm mt-1">
                      Este campo es requerido
                    </p>
                  )}
                </div>
              </div>
              {!readOnly && (
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-orange-400 cursor-pointer"
                  >
                    Registrar
                  </Button>
                </div>
              )}
            </div>

            <div className="md:flex hidden justify-center items-stretch">
              <Separator orientation="vertical" className="h-full" />
            </div>
            <div className="flex-1">
              {cuyId && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Registros</h3>
                  <div className="p-0 h-72 overflow-y-auto scroll-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Medicamento</TableHead>
                          <TableHead>Costo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sanidades.map((sanidad) => (
                          <TableRow key={sanidad.id}>
                            <TableCell>
                              {new Date(sanidad.fechaYHora).toLocaleDateString(
                                "es-PE"
                              )}
                            </TableCell>
                            <TableCell>{sanidad.nombreMedicamento}</TableCell>
                            <TableCell>S/ {sanidad.costo.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
