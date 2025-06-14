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
import { Separator } from "./ui/separator";
import { Card, CardContent } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { FaExclamationCircle } from "react-icons/fa";

interface CuyDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: Omit<Cuy, "id">) => void;
  readonly cuy?: Cuy | null;
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
          horaRegistro: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          categoria: "",
          estado: "APTO",
          sexo: "",
        });
      }
    }
  }, [open, cuy, reset]);

  const handleFormSubmit = (data: Omit<Cuy, "id">) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const nacidos = [
    { id: 1, sexo: "macho", java: "sin asignar", fecha: "00/00/000" },
    { id: 2, sexo: "macho", java: "sin asignar", fecha: "00/00/000" },
    { id: 3, sexo: "macho", java: "sin asignar", fecha: "00/00/000" },
    { id: 4, sexo: "macho", java: "sin asignar", fecha: "00/00/000" },
    { id: 5, sexo: "hembra", java: "sin asignar", fecha: "00/00/000" },
    { id: 6, sexo: "hembra", java: "sin asignar", fecha: "00/00/000" },
    { id: 7, sexo: "hembra", java: "sin asignar", fecha: "00/00/000" },
    { id: 8, sexo: "hembra", java: "sin asignar", fecha: "00/00/000" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {cuy ? `Editar cuy ${cuy.id}` : "Añadir cuy"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6">
          {/* Formulario a la izquierda */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4 flex-1"
          >
            <div className="flex gap-4 w-full flex-col md:flex-row">
              <div className="flex-1">
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
              <div className="flex-1">
                <Label className="mb-1 block">Hora</Label>
                <Input
                  type="time"
                  {...register("horaRegistro", { required: true })}
                />
                {errors.horaRegistro && (
                  <p className="text-red-500 text-sm mt-1">
                    Este campo es requerido
                  </p>
                )}
              </div>
            </div>
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
              <Label className="mb-1 block">Categoría</Label>
              <Select
                onValueChange={(value) => setValue("categoria", value)}
                defaultValue={watch("categoria")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENGORDE">ENGORDE</SelectItem>
                  <SelectItem value="REPRODUCTOR">REPRODUCTOR</SelectItem>
                  <SelectItem value="CRIA">CRIA</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoria && (
                <p className="text-red-500 text-sm mt-1">
                  Este campo es requerido
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1 block">Sexo</Label>
              <Select
                onValueChange={(value) => setValue("sexo", value)}
                defaultValue={watch("sexo")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MACHO">MACHO</SelectItem>
                  <SelectItem value="HEMBRA">HEMBRA</SelectItem>
                </SelectContent>
              </Select>
              {errors.sexo && (
                <p className="text-red-500 text-sm mt-1">
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className="mb-4">
              <Label className="mb-1 block">Java</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    onValueChange={(value) => setValue("java", +value)}
                    defaultValue={watch("java")?.toString() || "0"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Java 1</SelectItem>
                      <SelectItem value="2">Java 2</SelectItem>
                      <SelectItem value="3">Java 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <FaExclamationCircle className="text-primary cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Debes crear una java para activar este casillero</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {errors.java && (
                <p className="text-red-500 text-sm mt-1">
                  Este campo es requerido
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1 block">Estado</Label>
              <Select
                onValueChange={(value) => setValue("estado", value)}
                value={watch("estado") || "APTO"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENDIDO">VENDIDO</SelectItem>
                  <SelectItem value="APTO">APTO</SelectItem>
                  <SelectItem value="CAMADA">CAMADA</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && (
                <p className="text-red-500 text-sm mt-1">
                  Este campo es requerido
                </p>
              )}
            </div>
          </form>

          <div className="flex justify-center items-stretch">
            <Separator orientation="vertical" className="h-full" />
          </div>

          <div className="flex-1">
            <h2 className="text-base font-bold mb-4">Lista de nacidos</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>SEXO</TableHead>
                      <TableHead>JAVA</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nacidos.map((nacido) => (
                      <TableRow key={nacido.id}>
                        <TableCell>{nacido.id}</TableCell>
                        <TableCell>{nacido.sexo}</TableCell>
                        <TableCell>{nacido.java}</TableCell>
                        <TableCell>{nacido.fecha}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="bg-primary cursor-pointer hover:bg-orange-400"
            onClick={() => handleSubmit(handleFormSubmit)()}
          >
            {cuy ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
