"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Cuy, CuyRequest } from "@/types/cuy";
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
import { getJavasDisponibles } from "@/services/javaService";
import { toast } from "sonner";

interface CuyDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: CuyRequest) => void;
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
  } = useForm<CuyRequest>();

  const [javasDisponibles, setJavasDisponibles] = useState<
    { id: number; nombre: string }[]
  >([]);

  const sexo = watch("sexo");
  const categoria = watch("categoria");

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
          java: { id: 0 },
          estado: "APTO",
          sexo: "",
        });
      }
    }
  }, [open, cuy, reset]);

  // Cuando cambia sexo o categoría, cargamos las javas
  useEffect(() => {
    if (sexo && categoria) {
      fetchJavasDisponibles(sexo, categoria);
    } else {
      setJavasDisponibles([]);
      setValue("java", { id: 0 });
    }
  }, [sexo, categoria, setValue]);

  const fetchJavasDisponibles = async (sexo: string, categoria: string) => {
    try {
      const res = await getJavasDisponibles(sexo, categoria);
      setJavasDisponibles(res);
    } catch {
      toast.error("Error al cargar javas disponibles");
    }
  };

  const handleFormSubmit = (data: CuyRequest) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const nacidos = [
    { id: 1, sexo: "macho", java: "sin asignar", fecha: "00/00/000" },
    { id: 2, sexo: "hembra", java: "sin asignar", fecha: "00/00/000" },
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
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4 flex-1"
          >
            {/* Fecha y hora */}
            <div className="flex gap-4 w-full flex-col md:flex-row">
              <div className="flex-1">
                <Label>Fecha de Registro</Label>
                <Input
                  type="date"
                  {...register("fechaRegistro", { required: true })}
                />
                {errors.fechaRegistro && (
                  <p className="text-red-500 text-sm">Requerido</p>
                )}
              </div>
              <div className="flex-1">
                <Label>Hora</Label>
                <Input
                  type="time"
                  {...register("horaRegistro", { required: true })}
                />
                {errors.horaRegistro && (
                  <p className="text-red-500 text-sm">Requerido</p>
                )}
              </div>
            </div>

            {/* Edad */}
            <div>
              <Label>Edad (semanas)</Label>
              <Input type="number" {...register("edad", { required: true })} />
              {errors.edad && <p className="text-red-500 text-sm">Requerido</p>}
            </div>

            {/* Categoría */}
            <div>
              <Label>Categoría</Label>
              <Select
                onValueChange={(value) => setValue("categoria", value)}
                defaultValue={categoria}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENGORDE">ENGORDE</SelectItem>
                  <SelectItem value="REPRODUCTOR">REPRODUCTOR</SelectItem>
                  <SelectItem value="CRIA">CRIA</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoria && (
                <p className="text-red-500 text-sm">Requerido</p>
              )}
            </div>

            {/* Sexo */}
            <div>
              <Label>Sexo</Label>
              <Select
                onValueChange={(value) => setValue("sexo", value)}
                defaultValue={sexo}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MACHO">MACHO</SelectItem>
                  <SelectItem value="HEMBRA">HEMBRA</SelectItem>
                </SelectContent>
              </Select>
              {errors.sexo && <p className="text-red-500 text-sm">Requerido</p>}
            </div>

            {/* Java */}
            <div className="mb-4">
              <Label>Java</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    onValueChange={(value) => setValue("java", { id: +value })}
                    defaultValue={watch("java")?.id?.toString() || ""}
                    disabled={!sexo || !categoria}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una Java" />
                    </SelectTrigger>
                    <SelectContent>
                      {javasDisponibles.map((java) => (
                        <SelectItem key={java.id} value={java.id.toString()}>
                          {java.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tooltip solo si no hay sexo o categoria */}
                {(!sexo || !categoria) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FaExclamationCircle className="text-primary cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Selecciona primero el sexo y la categoría</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Estado */}
            <div>
              <Label>Estado</Label>
              <Select
                onValueChange={(value) => setValue("estado", value)}
                value={watch("estado") || "APTO"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENDIDO">VENDIDO</SelectItem>
                  <SelectItem value="APTO">APTO</SelectItem>
                  <SelectItem value="CAMADA">CAMADA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>

          {/* Separador */}
          <div className="flex justify-center items-stretch">
            <Separator orientation="vertical" className="h-full" />
          </div>

          {/* Lista de nacidos */}
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
