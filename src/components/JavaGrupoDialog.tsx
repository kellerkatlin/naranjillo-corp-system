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

interface JavaGrupoDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

type FormData = {
  nombre: string;
  fechaInicio: string;
  padre: string;
  hembrasNacidas?: number;
  machosNacidos?: number;
  sexo?: string; // agregado
  categoria?: string; // agregado
  muertos?: number;
  madre: string;
  regiones: { [key: string]: boolean };
};

const madresDisponibles = [
  { id: 11, grupo: "Hembra", java: "Arequipa" },
  { id: 12, grupo: "Hembra", java: "Arequipa" },
  { id: 13, grupo: "Hembra", java: "Tacna" },
  { id: 14, grupo: "Hembra", java: "Tacna" },
];

export default function JavaGrupoDialog({
  open,
  onOpenChange,
}: JavaGrupoDialogProps) {
  const [isReproduccionIniciada, setIsReproduccionIniciada] = useState(false);
  const [padresDisponibles, setPadresDisponibles] = useState<CuyPadre[]>([]);

  const [seleccionActual, setSeleccionActual] = useState<
    "padre" | "madre" | "fecha" | null
  >(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      fechaInicio: "",
      categoria: "", // agregado
      sexo: "", // agregado
      padre: "",
      madre: "",
      hembrasNacidas: 0,
      machosNacidos: 0,
      muertos: 0,
      regiones: {},
    },
  });

  const categoria = watch("categoria");
  const sexo = watch("sexo");

  useEffect(() => {
    const fetchPadres = async () => {
      if (sexo && categoria) {
        try {
          const data = await getCuyesPadres("ENGORDE", "MACHO");
          setPadresDisponibles(data);
        } catch (error) {
          console.error("Error al obtener padres", error);
        }
      } else {
        setPadresDisponibles([]);
      }
    };

    fetchPadres();
  }, [sexo, categoria]);

  useEffect(() => {
    if (categoria === "REPRODUCCION" && watch("sexo") !== "NA") {
      setValue("sexo", "NA");
    } else if (categoria !== "REPRODUCCION") {
      setValue("sexo", "");
    }
  }, [categoria, setValue, watch]);

  const onSubmit = (data: FormData) => {
    console.log("Datos enviados:", data);
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

  const handleSeleccionMadre = (item: any) => {
    const current = [...madresSeleccionadas];
    const key = `${item.id} ${item.grupo} ${item.java}`;
    if (current.includes(key)) {
      setValue(
        "madre",
        current.filter((m) => m !== key)
      );
    } else {
      setValue("madre", [...current, key]);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <DialogTitle>Crear Java</DialogTitle>
        </AlertDialogHeader>

        <div className="flex gap-6 flex-col  justify-start md:flex-row">
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
                  {watch("fechaInicio") || "Seleccionar fecha"}
                </Button>
              </div>
            </div>
            <div className="flex items-center w-full flex-col md:flex-row gap-4">
              <div className="flex-1 w-1/2">
                <Label className="mb-2">Categoria</Label>
                <Select
                  onValueChange={(value) => setValue("categoria", value)}
                  disabled={isReproduccionIniciada}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="CRIA">CRIA</SelectItem>
                      <SelectItem value="REPRODUCCION">REPRODUCCION</SelectItem>
                      <SelectItem value="ENGORDE">ENGORDE</SelectItem>
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
              <div className="flex-1 w-full">
                <Label className="mb-2">Sexo</Label>
                <Select
                  disabled={categoria === "REPRODUCCION"}
                  value={watch("sexo") ?? ""}
                  onValueChange={(value) => setValue("sexo", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="MACHO">MACHO</SelectItem>
                      <SelectItem value="HEMBRA">HEMBRA</SelectItem>
                      {categoria === "REPRODUCCION" && (
                        <SelectItem value="NA">N/A</SelectItem>
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
                    onClick={() => setSeleccionActual("padre")}
                  >
                    {watch("padre") || "Seleccionar Padre"}
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
                      onClick={() => setSeleccionActual("madre")}
                    >
                      <div className="flex   text-sm flex-col text-center font-semibold w-full">
                        {madresSeleccionadas.map((madre, index) => (
                          <span key={index}>{madre}</span>
                        ))}
                      </div>
                    </Card>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-center flex-col items-start"
                      onClick={() => setSeleccionActual("madre")}
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
                          <TableHead>Grupo</TableHead>
                          <TableHead>Java</TableHead>
                          <TableHead>Check</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {padresDisponibles.map((item) => {
                          const key = `${item.id} ${item.sexo} ${item.java}`;
                          const selectedPadre = watch("padre");
                          return (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.sexo}</TableCell>
                              <TableCell>{item.java}</TableCell>
                              <TableCell>
                                <Checkbox
                                  disabled={isReproduccionIniciada}
                                  checked={selectedPadre === key}
                                  onCheckedChange={() => setValue("padre", key)}
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
                          <TableHead>Grupo</TableHead>
                          <TableHead>Java</TableHead>
                          <TableHead>Check</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {madresDisponibles.map((item) => {
                          const key = `${item.id} ${item.grupo} ${item.java}`;
                          return (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.grupo}</TableCell>
                              <TableCell>{item.java}</TableCell>
                              <TableCell>
                                <Checkbox
                                  disabled={isReproduccionIniciada}
                                  checked={madresSeleccionadas.includes(key)}
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
                  <CardContent className="p-4">
                    <input
                      type="date"
                      className="border rounded-md p-2 w-full"
                      value={watch("fechaInicio") || ""}
                      onChange={(e) => {
                        setValue("fechaInicio", e.target.value);
                        setSeleccionActual(null);
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
            disabled={!canStartReproduction()}
            onClick={() => setIsReproduccionIniciada(true)}
          >
            {isReproduccionIniciada
              ? "Finalizar Reproducción"
              : "Iniciar Reproducción"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
