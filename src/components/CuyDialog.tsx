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

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { FaExclamationCircle } from "react-icons/fa";
import { getCuySinJava, getJavasDisponibles } from "@/services/javaService";
import { toast } from "sonner";
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
import { Checkbox } from "./ui/checkbox";

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
  const [cuyesSinJava, setCuyesSinJava] = useState<Cuy[]>([]);
  const [cuySeleccionado, setCuySeleccionado] = useState<Cuy | null>(null);
  const categoria = watch("categoria");

  useEffect(() => {
    if (open) {
      if (cuy) {
        const fecha = cuy.fechaRegistro.split("T")[0];
        const hora =
          cuy.fechaRegistro.split("T")[1]?.substring(0, 5) ?? "00:00";

        reset({
          ...cuy,
          fechaRegistro: fecha,
          horaRegistro: hora,
        });
      } else {
        const hoy = new Date();
        const fechaLocal = hoy.toLocaleDateString("sv-SE");
        reset({
          edad: 0,
          fechaRegistro: fechaLocal,
          horaRegistro: hoy.toTimeString().slice(0, 5), // hora local exacta HH:mm
          categoria: "",
          java: { id: 0 },
          estado: "VIVO",
          sexo: "",
        });
      }
    }
  }, [open, cuy, reset]);

  const isEditMode = !!cuy;

  const sexo = watch("sexo");

  useEffect(() => {
    if (sexo && categoria) {
      fetchJavasDisponibles(sexo, categoria);
    } else {
      setJavasDisponibles([]);
    }
  }, [sexo, categoria, setValue]);

  useEffect(() => {
    if (categoria !== "") {
      getCuySinJava(categoria ?? "ENGORDE")
        .then(setCuyesSinJava)
        .catch(() => console.error("Error al cargar cuyes sin java"));
    }
  }, [categoria]);

  const handleFormSubmit = (data: CuyRequest) => {
    const fecha = data.fechaRegistro;
    const hora = data.horaRegistro;
    const fechaHora = `${fecha}T${hora}:00`;

    const dataToSend = {
      ...data,
      fechaRegistro: fechaHora,
    };

    if (!data.id) {
      delete dataToSend.id;
    }

    onSubmit(dataToSend);
    onOpenChange(false);
  };

  const fetchJavasDisponibles = async (sexo: string, categoria: string) => {
    try {
      const res = await getJavasDisponibles(sexo, categoria);
      setJavasDisponibles(res);
    } catch {
      toast.error("Error al cargar javas disponibles");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl md:min-w-4xl  py-10  max-h-[90vh]  overflow-y-auto ">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {cuy ? `Editar cuy ${cuy.id}` : "Añadir cuy"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-6 flex-col  md:justify-between md:flex-row">
            {/* Formulario a la izquierda */}
            <div className="space-y-4 flex-1 mt-5">
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
              <div className="flex-1 flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <Label className="mb-1 block">Edad (días)</Label>
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
                <div className="flex-1 mt-3 md:mt-0">
                  <Label className="mb-1 block">Peso</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      placeholder="Peso"
                      {...register("peso", { required: true })}
                    />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FaExclamationCircle className="text-primary cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div>
                          <div>Para Ingresar peso</div>
                          <div>1/2 Kg = 0.500</div>
                          <div>1 Kg = 1000.00</div>
                          <div>2 Kg = 2000.00</div>
                          <div>3 Kg = 3000.00</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {errors.peso && (
                    <p className="text-red-500 text-sm mt-1">
                      Este campo es requerido
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Categoría</Label>
                <Select
                  onValueChange={(value) => setValue("categoria", value)}
                  value={watch("categoria") || ""}
                  defaultValue={watch("categoria")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENGORDE">ENGORDE</SelectItem>
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
                  value={watch("sexo")}
                  defaultValue={sexo}
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
                      onValueChange={(value) => {
                        setValue("java", { id: +value });
                        if (!isEditMode) {
                          setValue("estado", "VIVO");
                        }
                      }}
                      defaultValue={watch("java")?.id?.toString() || ""}
                      disabled={!sexo || !categoria}
                    >
                      <SelectTrigger className="w-full">
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

              {/* <div>
                <Label className="mb-1 block">Estado</Label>
                <Select
                  onValueChange={(value) => setValue("estado", value)}
                  value={watch("estado") || "VIVO"}
                  disabled={!isEditMode && !!watch("java")?.id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIVO">VIVO</SelectItem>
                    <SelectItem value="MUERTO">MUERTO</SelectItem>
                  </SelectContent>
                </Select>
                {errors.estado && (
                  <p className="text-red-500 text-sm mt-1">
                    Este campo es requerido
                  </p>
                )}
              </div> */}
            </div>

            <div className="md:flex hidden justify-center items-stretch">
              <Separator orientation="vertical" className="h-full" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col">
                <Label className="mb-3 block text-center">
                  {categoria === "CRIA" ? "Crias sin Java" : "Cuyes sin Java"}
                </Label>
                {categoria !== "" && (
                  <Card>
                    <CardContent className="p-0 ">
                      <div className="max-h-64 overflow-y-auto">
                        {cuyesSinJava.length ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Sexo</TableHead>
                                <TableHead>Sel.</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {cuyesSinJava.map((cuy) => {
                                return (
                                  <TableRow
                                    key={cuy.id}
                                    className={
                                      cuySeleccionado?.id === cuy.id
                                        ? "bg-muted"
                                        : ""
                                    }
                                  >
                                    <TableCell>{cuy.id}</TableCell>
                                    <TableCell>{cuy.sexo}</TableCell>
                                    <TableCell>
                                      <Checkbox
                                        checked={cuySeleccionado?.id === cuy.id}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setCuySeleccionado(cuy);
                                            const fecha =
                                              cuy.fechaRegistro.split("T")[0];
                                            const hora =
                                              cuy.fechaRegistro
                                                .split("T")[1]
                                                ?.substring(0, 5) ?? "00:00";

                                            // Calcular edad en semanas desde fechaRegistro hasta hoy
                                            const fechaRegistroDate = new Date(
                                              fecha
                                            );
                                            const hoyDate = new Date();
                                            const diffMs =
                                              hoyDate.getTime() -
                                              fechaRegistroDate.getTime();
                                            const diffDias = Math.floor(
                                              diffMs / (1000 * 60 * 60 * 24)
                                            );

                                            reset({
                                              ...cuy,
                                              id: cuy.id,
                                              sexo: cuy.sexo,
                                              java: { id: cuy.java?.id || 0 },
                                              estado: cuy.estado,
                                              categoria: cuy.categoria,
                                              edad:
                                                categoria === "ENGORDE"
                                                  ? cuy.edad
                                                  : diffDias,
                                              fechaRegistro: fecha,
                                              horaRegistro: hora,
                                            });
                                          } else {
                                            setCuySeleccionado(null);
                                            const hoy = new Date();
                                            const fechaLocal =
                                              hoy.toLocaleDateString("sv-SE");
                                            reset({
                                              id: undefined,
                                              edad: 0,
                                              fechaRegistro: fechaLocal,

                                              horaRegistro: hoy
                                                .toTimeString()
                                                .slice(0, 5),
                                              categoria: "",
                                              java: { id: 0 },
                                              estado: "VIVO",
                                              sexo: "",
                                            });
                                          }
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-gray-400 text-center p-4">
                            No hay cuyes.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-primary cursor-pointer hover:bg-orange-400"
            >
              {cuy ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
