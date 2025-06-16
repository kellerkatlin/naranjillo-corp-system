import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { AlertDialogHeader } from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
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
import { Minus, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getCuyesPadres } from "@/services/javaService";
import { CuyPadre } from "@/types/cuy";
import { Calendar } from "./ui/calendar";

interface JavaGrupoDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly mode: "REPRODUCCION" | "MACHO" | "HEMBRA";
  readonly onSubmit: (data: DataJava) => void;
}

export type DataJava = {
  nombre: string;
  fechaInicio: Date | null;
  padre: { id: number; sexo: string } | null;
  hembrasNacidas?: number;
  machosNacidos?: number;
  sexo?: string;
  categoria?: string;
  muertos?: number;
  madre: { id: number; sexo: string }[];
  regiones: { [key: string]: boolean };
};

export default function JavaGrupoDialog({
  open,
  onOpenChange,
  onSubmit,
  mode,
}: JavaGrupoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isReproduccionIniciada, setIsReproduccionIniciada] = useState(false);
  const [padresDisponibles, setPadresDisponibles] = useState<CuyPadre[]>([]);
  const [madresDisponibles, setMadresDisponibles] = useState<CuyPadre[]>([]);

  const [seleccionActual, setSeleccionActual] = useState<
    "padre" | "madre" | "fecha" | null
  >(null);

  const {
    register,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DataJava>({
    defaultValues: {
      nombre: "",
      fechaInicio: null,
      categoria: "REPRODUCCION",
      sexo: "",
      padre: null,
      madre: [],
      hembrasNacidas: 0,
      machosNacidos: 0,
      muertos: 0,
      regiones: {},
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "REPRODUCCION") {
        reset({
          nombre: "",
          fechaInicio: null,
          categoria: "REPRODUCCION",
          sexo: "NA",
          padre: null,
          madre: [],
          hembrasNacidas: 0,
          machosNacidos: 0,
          muertos: 0,
          regiones: {},
        });
      } else {
        reset({
          nombre: "",
          fechaInicio: null,
          categoria: "CRIA",
          sexo: mode, // Modo es MACHO o HEMBRA
          padre: null,
          madre: [],
          hembrasNacidas: 0,
          machosNacidos: 0,
          muertos: 0,
          regiones: {},
        });
      }
    }
  }, [open, reset, mode]);

  const categoria = watch("categoria");

  const handleOpenPadre = async () => {
    try {
      const data = await getCuyesPadres("MACHO", "ENGORDE");
      setPadresDisponibles(data);
      setSeleccionActual("padre");
    } catch (error) {
      console.error("Error al obtener padres", error);
    }
  };

  const handleOpenMadre = async () => {
    try {
      const data = await getCuyesPadres("HEMBRA", "ENGORDE");
      setMadresDisponibles(data); // usas el mismo setPadresDisponibles si quieres, o mejor aún, lo renombramos a algo más genérico
      setSeleccionActual("madre");
    } catch (error) {
      console.error("Error al obtener madres", error);
    }
  };

  const handleFinalSubmit = async () => {
    const formData = {
      ...watch(),
    };
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onOpenChange(false); // Cerrar el modal después de enviar
    } catch (error) {
      console.error("Error al enviar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const madresSeleccionadas = watch("madre") || [];

  const canStartReproduction = () => {
    const nombre = watch("nombre");
    const fechaInicio = watch("fechaInicio");
    const categoria = watch("categoria");
    const sexo = watch("sexo");
    const padre = watch("padre");
    const madre = watch("madre");

    if (!nombre || !fechaInicio || !categoria || !sexo) {
      return false;
    }

    if (categoria === "REPRODUCCION" && (!padre || madre.length === 0)) {
      return false;
    }

    return true;
  };

  const handleSeleccionMadre = (item: CuyPadre) => {
    const current = watch("madre") || [];
    const exists = current.find((m) => m.id === item.id);
    if (exists) {
      setValue(
        "madre",
        current.filter((m) => m.id !== item.id)
      );
    } else {
      setValue("madre", [...current, { id: item.id, sexo: item.sexo }]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <DialogTitle>Crear Java</DialogTitle>
        </AlertDialogHeader>

        <div className="flex gap-6 flex-col  md:justify-between md:flex-row">
          <form className="space-y-4 flex-1 ">
            <div className="flex w-full flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="mb-1 block">Nombre de Java</Label>
                <Input
                  {...register("nombre", { required: true })}
                  placeholder="Nombre"
                  disabled={isReproduccionIniciada}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">
                    Este campo es requerido
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Label className="mb-1 block">Fecha de Inicio</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setSeleccionActual("fecha")}
                  disabled={isReproduccionIniciada}
                >
                  {watch("fechaInicio")
                    ? watch("fechaInicio")?.toLocaleDateString("es-PE")
                    : "Seleccionar fecha"}
                </Button>
              </div>
            </div>
            <div className="flex items-center w-full flex-col md:flex-row gap-4">
              <div className="flex-1 w-1/2">
                <Label className="mb-2">Categoria</Label>
                <Select
                  value={watch("categoria")}
                  onValueChange={(value) => setValue("categoria", value)}
                  disabled={
                    isReproduccionIniciada ||
                    watch("categoria") === "REPRODUCCION"
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {mode === "REPRODUCCION" && (
                        <SelectItem value="REPRODUCCION">
                          REPRODUCCION
                        </SelectItem>
                      )}
                      {mode !== "REPRODUCCION" && (
                        <>
                          <SelectItem value="CRIA">CRIA</SelectItem>
                          <SelectItem value="ENGORDE">ENGORDE</SelectItem>
                        </>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {categoria === "REPRODUCCION" && (
                <div className="flex-1 w-full">
                  <Label
                    className={`flex items-center gap-1 mb-2 ${
                      isReproduccionIniciada ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    Hembras Nacidas
                  </Label>
                  <div
                    className={`flex items-center gap-1 ${
                      isReproduccionIniciada ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    <Input
                      type="number"
                      value={watch("hembrasNacidas") ?? 0}
                      disabled
                      className="text-center   disabled:opacity-100 bg-pink-400"
                    />
                    {errors.hembrasNacidas && (
                      <p className="text-red-500 text-sm mt-1">
                        Este campo es requerido
                      </p>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        const current = watch("hembrasNacidas") ?? 0;
                        if (current > 0) {
                          setValue("hembrasNacidas", current - 1);
                        }
                      }}
                      disabled={(watch("hembrasNacidas") ?? 0) <= 0}
                    >
                      <Minus />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={!isReproduccionIniciada}
                      onClick={() => {
                        const current = watch("hembrasNacidas") ?? 0;
                        setValue("hembrasNacidas", current + 1);
                      }}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center w-full flex-col md:flex-row gap-4">
              {mode !== "REPRODUCCION" && (
                <div className="flex-1 w-full">
                  <Label className="mb-2">Sexo</Label>
                  <Select
                    disabled
                    value={watch("sexo") ?? ""}
                    onValueChange={(value) => setValue("sexo", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mode === "MACHO" && (
                        <SelectItem value="MACHO">MACHO</SelectItem>
                      )}
                      {mode === "HEMBRA" && (
                        <SelectItem value="HEMBRA">HEMBRA</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {categoria === "REPRODUCCION" && (
                <div className="flex-1 w-full">
                  <Label
                    className={`flex items-center gap-1 mb-2 ${
                      isReproduccionIniciada ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    Machos Nacidos
                  </Label>
                  <div
                    className={`flex items-center gap-1 ${
                      isReproduccionIniciada ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    <Input
                      type="number"
                      value={watch("machosNacidos") ?? 0}
                      disabled
                      className=" text-center  disabled:opacity-100 bg-purple-400"
                    />
                    {errors.machosNacidos && (
                      <p className="text-red-500 text-sm mt-1">
                        Este campo es requerido
                      </p>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        const current = watch("machosNacidos") ?? 0;
                        if (current > 0) {
                          setValue("machosNacidos", current - 1);
                        }
                      }}
                      disabled={(watch("machosNacidos") ?? 0) <= 0}
                    >
                      <Minus />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={!isReproduccionIniciada}
                      onClick={() => {
                        const current = watch("machosNacidos") ?? 0;
                        setValue("machosNacidos", current + 1);
                      }}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {categoria === "REPRODUCCION" && (
              <div className="flex items-center w-full flex-col md:flex-row gap-4">
                <div className="flex-1 w-full">
                  <Label className="mb-2">Seleccionar Padre</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={handleOpenPadre}
                  >
                    {watch("padre")
                      ? `${watch("padre")?.id} - ${watch("padre")?.sexo}`
                      : "Seleccionar Padre"}
                  </Button>
                </div>
                <div className="flex-1 w-full">
                  <Label
                    className={`flex items-center gap-1 mb-2 ${
                      isReproduccionIniciada ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    Registrar Muertos
                  </Label>
                  <div
                    className={`flex items-center gap-1 ${
                      isReproduccionIniciada ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    <Input
                      type="number"
                      value={watch("muertos") ?? 0}
                      disabled
                      className=" text-center bg-gray-400 disabled:opacity-100"
                    />
                    {errors.muertos && (
                      <p className="text-red-500 text-sm mt-1">
                        Este campo es requerido
                      </p>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        const current = watch("muertos") ?? 0;
                        if (current > 0) {
                          setValue("muertos", current - 1);
                        }
                      }}
                      disabled={(watch("muertos") ?? 0) <= 0}
                    >
                      <Minus />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={!isReproduccionIniciada}
                      className="cursor-pointer"
                      onClick={() => {
                        const current = watch("muertos") ?? 0;
                        setValue("muertos", current + 1);
                      }}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {categoria === "REPRODUCCION" && (
              <div className="flex items-start w-1/2 flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label className="mb-2">Seleccionar Madres</Label>
                  {madresSeleccionadas.length > 0 ? (
                    <Card
                      className="cursor-pointer w-full hover:bg-gray-50"
                      onClick={handleOpenMadre}
                    >
                      <div className="flex text-sm flex-col text-center font-semibold w-full">
                        {madresSeleccionadas.map((madre, index) => (
                          <span key={index}>
                            {madre.id} - {madre.sexo}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-center flex-col items-start"
                      onClick={handleOpenMadre}
                    >
                      Seleccionar Madres
                    </Button>
                  )}
                </div>
              </div>
            )}
          </form>

          <div className="md:flex hidden justify-center items-stretch">
            <Separator orientation="vertical" className="h-full" />
          </div>

          <div className="flex-1">
            {/* Aquí renderizamos la tabla dependiendo de lo seleccionado */}
            {seleccionActual === "padre" && (
              <>
                <h2 className="text-base font-bold mb-4">Seleccionar Padre</h2>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Id</TableHead>
                          <TableHead>Sexo</TableHead>
                          <TableHead>Check</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {padresDisponibles.map((item) => {
                          return (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.sexo}</TableCell>
                              <TableCell>
                                <Checkbox
                                  disabled={isReproduccionIniciada}
                                  checked={watch("padre")?.id === item.id}
                                  onCheckedChange={() =>
                                    setValue("padre", {
                                      id: item.id,
                                      sexo: item.sexo,
                                    })
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}

            {seleccionActual === "madre" && (
              <>
                <h2 className="text-base font-bold mb-4">Seleccionar Madres</h2>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Id</TableHead>
                          <TableHead>Sexo</TableHead>
                          <TableHead>Check</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {madresDisponibles.map((item) => {
                          return (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.sexo}</TableCell>
                              <TableCell>
                                <Checkbox
                                  disabled={isReproduccionIniciada}
                                  checked={madresSeleccionadas.some(
                                    (m) => m.id === item.id
                                  )}
                                  onCheckedChange={() =>
                                    handleSeleccionMadre(item)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}

            {seleccionActual === "fecha" && (
              <>
                <h2 className="text-base font-bold mb-4">
                  Seleccionar Fecha de Inicio
                </h2>
                <Card>
                  <CardContent className="p-4 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={
                        watch("fechaInicio") !== null
                          ? new Date(watch("fechaInicio") as Date)
                          : undefined
                      }
                      onSelect={(date) => {
                        setValue("fechaInicio", date ?? null);
                      }}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            className={
              !isReproduccionIniciada
                ? "bg-green-600 hover:bg-green-700"
                : "bg-primary hover:bg-primary/90"
            }
            disabled={!canStartReproduction() || isSubmitting}
            onClick={() => {
              if (categoria === "REPRODUCCION") {
                if (isReproduccionIniciada) {
                  handleFinalSubmit();
                } else {
                  setIsReproduccionIniciada(true);
                }
              } else {
                handleFinalSubmit();
              }
            }}
          >
            {categoria === "REPRODUCCION"
              ? isReproduccionIniciada
                ? "Finalizar Reproducción"
                : "Iniciar Reproducción"
              : "Crear Java"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
