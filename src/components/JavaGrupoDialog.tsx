import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
import { Minus, Pen, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  cambioPadreDeJava,
  getAllJava,
  getCuyesPadres,
  updateJavaCuyReproduccion,
} from "@/services/javaService";
import { CuyPadre } from "@/types/cuy";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";
import { JavaRespose } from "@/types/java";
import { TimeLine } from "./TimeLine";

interface JavaGrupoDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly mode: "REPRODUCCION" | "MACHO" | "HEMBRA";
  readonly onSubmitCreate: (data: DataJava) => void;
  readonly onSubmitUpdate: (data: DataJava) => void;
  readonly javaToEdit?: DataJava;
}

type Cria = {
  id: number;
  sexo: "HEMBRA" | "MACHO";
  peso: number;
  fechaRegistro: string;
};
export type DataJava = {
  id: number | null;
  nombre: string;
  fechaReproduccion: Date | null;
  padre: CuyPadre | null;
  hembrasNacidas?: number;
  machosNacidos?: number;
  sexo?: string;
  categoria?: string;
  muertos?: number;
  madre: CuyPadre[];
  regiones: { [key: string]: boolean };
  cuyes?: Array<{
    id: number;
    nombre: string;
    sexo: string;
    categoria: string;
    fechaRegistro: string;
  }>;
};

export default function JavaGrupoDialog({
  open,
  onOpenChange,
  onSubmitCreate,
  onSubmitUpdate,
  mode,
  javaToEdit,
}: JavaGrupoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!javaToEdit;
  const [isReproduccionIniciada] = useState(false);
  const [padresDisponibles, setPadresDisponibles] = useState<CuyPadre[]>([]);
  const [madresDisponibles, setMadresDisponibles] = useState<CuyPadre[]>([]);
  const [javasMachos, setJavasMachos] = useState<JavaRespose[]>([]);
  const [javasHembras, setJavasHembras] = useState<JavaRespose[]>([]);
  const [selectedJavaId, setSelectedJavaId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [crias, setCrias] = useState<Cria[]>([]);
  const nextCriaId = useRef(1);
  const [showCrias, setShowCrias] = useState(false);
  const [seleccionActual, setSeleccionActual] = useState<
    "padre" | "madre" | "fecha" | "crias" | "lista" | null
  >("lista");

  const {
    register,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DataJava>({
    defaultValues: {
      nombre: "",
      fechaReproduccion: null,
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
  const padreSel = watch("padre");

  useEffect(() => {
    if (open) {
      if (isEditing && javaToEdit) {
        reset({
          ...javaToEdit,
          madre: javaToEdit?.madre ?? [],
          cuyes: javaToEdit?.cuyes ?? [],
        });
      } else {
        reset({
          nombre: "",
          fechaReproduccion: null,
          categoria: mode === "REPRODUCCION" ? "REPRODUCCION" : "CRIA",
          sexo: mode === "REPRODUCCION" ? "NA" : mode,
          padre: null,
          madre: [],
          hembrasNacidas: 0,
          machosNacidos: 0,
          muertos: 0,
          regiones: {},
        });
      }
    }
    setSeleccionActual("lista");
  }, [open, reset, isEditing, javaToEdit, mode]);

  const categoria = watch("categoria");

  useEffect(() => {
    getAllJava("MACHO", "ENGORDE")
      .then(setJavasMachos)
      .catch(() => toast.error("Error al cargar javas"));
    getAllJava("HEMBRA", "ENGORDE")
      .then(setJavasHembras)
      .catch(() => toast.error("Error al cargar javas hembras"));
  }, []);

  const canToggleCheckbox = (rowId: number) => {
    if (!padreSel) return true;

    const existeEnLista = padresDisponibles.some((p) => p.id === padreSel.id);

    if (existeEnLista) return rowId === padreSel.id;

    return false;
  };

  const handleOpenPadre = async () => {
    try {
      const data = await getCuyesPadres("MACHO", "ENGORDE");
      setPadresDisponibles(data);
      setSeleccionActual("padre");
    } catch {
      toast.error("Error al obtener padres");
    }
  };

  const handleOpenMadre = async () => {
    try {
      const data = await getCuyesPadres("HEMBRA", "ENGORDE");
      const seleccionadas: CuyPadre[] = watch("madre") || [];

      const idsSel = new Set(seleccionadas.map((m) => m.id));

      const nuevas = data.filter((item) => !idsSel.has(item.id));

      setMadresDisponibles([...seleccionadas, ...nuevas]);
      setSeleccionActual("madre");
    } catch (error) {
      console.error("Error al obtener madres", error);
    }
  };

  const doCambioPadre = async () => {
    const selectedCuyId = watch("padre")?.id;
    if (!selectedJavaId || !selectedCuyId) return;
    try {
      await cambioPadreDeJava(selectedJavaId, selectedCuyId);
      toast.success("Padre cambiado correctamente");
      setValue("padre", null);
      setPadresDisponibles([]);
    } catch {
      toast.error("Error al cambiar padre");
    }
  };

  const doCambioMadre = async () => {
    const madresSel: CuyPadre[] = watch("madre") || [];
    if (!selectedJavaId || madresSel.length === 0) return;

    // Tomamos la primera madre para enviar y el resto
    const [madreEnviada, ...otrasMadres] = madresSel;

    try {
      await cambioPadreDeJava(selectedJavaId, madreEnviada.id);
      toast.success("Madre cambiada correctamente");

      // 1) Quitamos sólo la enviada del campo 'madre'
      setValue("madre", otrasMadres);

      // 2) (Opcional) Removemos también de la lista de disponibles
      // setMadresDisponibles((prev) =>
      //   prev.filter((m) => m.id !== madreEnviada.id)
      // );
    } catch {
      toast.error("Error al cambiar madre");
    }
  };

  const handleSubmitUpdateOnlyCounters = async () => {
    try {
      setIsSubmitting(true);
      const dataToUpdate: DataJava = {
        id: javaToEdit?.id ?? null,
        nombre: javaToEdit?.nombre ?? "", // Lo que ya tienes
        categoria: javaToEdit?.categoria ?? "",
        fechaReproduccion: javaToEdit?.fechaReproduccion ?? null,
        padre: javaToEdit?.padre ?? null,
        madre: javaToEdit?.madre ?? [],
        regiones: javaToEdit?.regiones ?? {},
        hembrasNacidas: watch("hembrasNacidas") ?? 0,
        machosNacidos: watch("machosNacidos") ?? 0,
        muertos: watch("muertos") ?? 0,
      };
      await onSubmitUpdate(dataToUpdate);
      onOpenChange(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    const formData = {
      ...watch(),
    };
    try {
      setIsSubmitting(true);
      if (isEditing) {
        await onSubmitUpdate(formData);
      } else {
        await onSubmitCreate(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error al enviar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const madresSeleccionadas = watch("madre") || [];

  const canStartReproduction = () => {
    const nombre = watch("nombre");
    const fechaReproduccion = watch("fechaReproduccion");
    const categoria = watch("categoria");
    const sexo = watch("sexo");
    const padre = watch("padre");
    const madre = watch("madre");

    if (!nombre || !fechaReproduccion || !categoria || !sexo) {
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
      setValue("madre", [...current, item]);
    }
  };

  const handleRegistrarCrias = () => {
    nextCriaId.current = 1;

    const hembras = watch("hembrasNacidas") ?? 0;
    const machos = watch("machosNacidos") ?? 0;
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const fechaStr = `${dd}/${mm}/${yyyy} ${hh}:${min}`;

    const nuevas: Cria[] = [];
    for (let i = 0; i < hembras; i++) {
      nuevas.push({
        id: nextCriaId.current++,
        sexo: "HEMBRA",
        peso: 0,
        fechaRegistro: fechaStr,
      });
    }
    for (let i = 0; i < machos; i++) {
      nuevas.push({
        id: nextCriaId.current++,
        sexo: "MACHO",
        peso: 0,
        fechaRegistro: fechaStr,
      });
    }

    setCrias(nuevas);
  };

  const TablaPadre = () => (
    <>
      <h2 className="text-base text-center font-bold mb-4">
        Seleccionar nuevo Padre
      </h2>

      <Card>
        <CardContent className="p-0">
          {padresDisponibles.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Java</TableHead>
                  <TableHead>Sel.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {padresDisponibles.map((cuy) => {
                  const isChecked = padreSel?.id === cuy.id;
                  const isEnabled = canToggleCheckbox(cuy.id);

                  return (
                    <TableRow key={cuy.id}>
                      <TableCell>{cuy.id}</TableCell>
                      <TableCell>{cuy.sexo}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={isChecked}
                          disabled={!isEnabled}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setValue("padre", cuy); // seleccionar
                            } else if (isChecked) {
                              setValue("padre", null); // des-seleccionar
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
            <div className="text-gray-400 text-center p-4">No hay cuyes.</div>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <div className="mt-4 flex gap-2 items-center">
          <Label>Java destino:</Label>
          <Select
            value={selectedJavaId?.toString()}
            onValueChange={(v) => setSelectedJavaId(Number(v))}
            disabled={!padreSel || padreSel === null}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {javasMachos.map((j) => (
                  <SelectItem key={j.id} value={j.id.toString()}>
                    {j.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={doCambioPadre}
            disabled={!selectedJavaId || !padreSel}
          >
            Cambiar Padre
          </Button>
        </div>
      )}
    </>
  );

  const TablaMadre = () => (
    <>
      <h2 className="text-base text-center font-bold mb-4">
        Seleccionar Madres
      </h2>

      <Card>
        <CardContent className="p-0">
          {madresDisponibles.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Java</TableHead>
                  <TableHead>Sel.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {madresDisponibles.map((item) => {
                  const isChecked = madresSeleccionadas.some(
                    (m) => m.id === item.id
                  );
                  const isEnabled = !isReproduccionIniciada;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.sexo}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={isChecked}
                          disabled={!isEnabled}
                          onCheckedChange={() => handleSeleccionMadre(item)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-gray-400 text-center p-4">No hay cuyes.</div>
          )}
        </CardContent>
      </Card>

      {/* select java destino + botón, si quieres replicar también este bloque */}
      {isEditing && (
        <div className="mt-4 flex gap-2 items-center">
          <Label>Java destino:</Label>
          <Select
            value={selectedJavaId?.toString()}
            onValueChange={(v) => setSelectedJavaId(Number(v))}
            disabled={madresSeleccionadas.length === 0}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {javasHembras.map((j) => (
                  <SelectItem key={j.id} value={j.id.toString()}>
                    {j.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={doCambioMadre}
            disabled={madresSeleccionadas.length === 0 || !selectedJavaId}
          >
            Cambiar Madres
          </Button>
        </div>
      )}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl md:min-w-4xl  py-10  min-h-[90vh]  overflow-y-auto">
        <AlertDialogHeader>
          <DialogTitle>
            {mode === "REPRODUCCION"
              ? isEditing
                ? "Editar Reproducción"
                : "Crear Java Reproducción"
              : mode === "MACHO"
              ? isEditing
                ? "Editar Machos"
                : "Crear Java Machos"
              : isEditing
              ? "Editar Hembras"
              : "Crear Java Hembras"}
          </DialogTitle>
        </AlertDialogHeader>

        <div className="flex flex-col h-full  md:justify-between md:flex-row">
          <form className=" flex-1 flex flex-col h-full justify-between ">
            <div className="flex-1 space-y-4">
              {isEditing && categoria !== "REPRODUCCION" && (
                <div>
                  <Button
                    type="button"
                    onClick={() => setSeleccionActual("lista")}
                    className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer"
                  >
                    Ver cuyes
                  </Button>
                </div>
              )}
              <div className="flex w-full flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label className="mb-1 block">Nombre de Java</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      {...register("nombre", { required: true })}
                      placeholder="Nombre"
                      disabled={isReproduccionIniciada || isEditing}
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-sm mt-1">
                        Este campo es requerido
                      </p>
                    )}

                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-primary hover:bg-primary/60 text-white"
                          disabled={isReproduccionIniciada}
                        >
                          <Pen />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle>Editar Nombre</DialogTitle>
                        </DialogHeader>

                        <div className="mt-4">
                          {/* Usamos watch y setValue para ligar al mismo form */}
                          <Input
                            value={watch("nombre")}
                            onChange={(e) => setValue("nombre", e.target.value)}
                            placeholder="Nuevo nombre"
                          />
                        </div>

                        <DialogFooter className="mt-6 flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            onClick={() => setModalOpen(false)}
                          >
                            Cancelar
                          </Button>
                          {/* Aquí ya no es submit, solo cierra y deja el valor */}
                          <Button onClick={() => setModalOpen(false)}>
                            Guardar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="flex-1">
                  <Label className="mb-1 block">Fecha de Inicio</Label>
                  {(() => {
                    const fechaReproduccion = watch("fechaReproduccion");
                    let fechaReproduccionStr = "Seleccionar fecha";
                    if (fechaReproduccion) {
                      if (fechaReproduccion instanceof Date) {
                        fechaReproduccionStr =
                          fechaReproduccion.toLocaleDateString("es-PE");
                      } else if (
                        typeof fechaReproduccion === "string" ||
                        typeof fechaReproduccion === "number"
                      ) {
                        const dateObj = new Date(fechaReproduccion);
                        if (!isNaN(dateObj.getTime())) {
                          fechaReproduccionStr =
                            dateObj.toLocaleDateString("es-PE");
                        }
                      }
                    }
                    return (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setSeleccionActual("fecha")}
                        disabled={isReproduccionIniciada}
                      >
                        {fechaReproduccionStr}
                      </Button>
                    );
                  })()}
                </div>
              </div>
              <div className="flex w-full flex-col md:flex-row gap-4">
                {categoria !== "REPRODUCCION" && (
                  <div className="flex items-center w-full flex-col md:flex-row gap-4">
                    <div className="flex-1 w-full">
                      <div className={`w-full`}>
                        <Label className="mb-2">Categoria</Label>
                        <Select
                          value={watch("categoria")}
                          onValueChange={(value) =>
                            setValue("categoria", value)
                          }
                          disabled={
                            watch("categoria") === "REPRODUCCION" || isEditing
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
                                  <SelectItem value="ENGORDE">
                                    ENGORDE
                                  </SelectItem>
                                </>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {mode !== "REPRODUCCION" && (
                  <div className="flex items-center w-full flex-col md:flex-row gap-4">
                    {/* <div className="flex-1 w-full">
                    <div className="w-full">
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
                  </div> */}
                  </div>
                )}
              </div>
              {categoria === "REPRODUCCION" && (
                <div className="flex gap-2">
                  <div className="flex-1 w-full flex-col gap-4">
                    <div className="flex-1 w-full">
                      <Label className="mb-2">Padre</Label>

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
                      <Label className="mb-2">Madres</Label>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full  text-center flex-col items-center"
                        onClick={handleOpenMadre}
                      >
                        Seleccionar Madres
                      </Button>

                      {/* Aquí mostramos las madres seleccionadas */}
                      <Card className="w-full mt-2">
                        <CardContent className="p-2">
                          {madresSeleccionadas.length > 0 ? (
                            <div className="flex flex-col text-center font-semibold">
                              {madresSeleccionadas.map((madre, index) => (
                                <span key={index}>
                                  {madre.id} - {madre.sexo}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-gray-400">
                              No se seleccionaron madres
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <Label className="mb-2"> Registrar crias</Label>

                    <Card>
                      <div className="p-1">
                        <div>
                          <Label
                            className={`flex items-center gap-1 mb-2  ${
                              isEditing ? "opacity-100" : "opacity-60"
                            }`}
                          >
                            Hembras Nacidas
                          </Label>
                          <div
                            className={`flex items-center gap-1  ${
                              isEditing ? "opacity-100" : "opacity-60"
                            } `}
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
                              disabled={!isEditing}
                              onClick={() => {
                                const current = watch("hembrasNacidas") ?? 0;
                                setValue("hembrasNacidas", current + 1);
                              }}
                            >
                              <Plus />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label
                            className={`flex items-center gap-1 mb-2  ${
                              isEditing ? "opacity-100" : "opacity-60"
                            }`}
                          >
                            Machos Nacidos
                          </Label>
                          <div
                            className={`flex items-center gap-1   ${
                              isEditing ? "opacity-100" : "opacity-60"
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
                              disabled={!isEditing}
                              onClick={() => {
                                const current = watch("machosNacidos") ?? 0;
                                setValue("machosNacidos", current + 1);
                              }}
                            >
                              <Plus />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label
                            className={`flex items-center gap-1 mb-2 ${
                              isEditing ? "opacity-100" : "opacity-60"
                            }`}
                          >
                            Registrar Muertos
                          </Label>
                          <div
                            className={`flex items-center gap-1 ${
                              isEditing ? "opacity-100" : "opacity-60"
                            } `}
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
                              disabled={!isEditing}
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
                        <Button
                          type="button"
                          disabled={!isEditing}
                          className="bg-green-400 w-full mt-3 hover:bg-green-300"
                          onClick={handleRegistrarCrias}
                        >
                          Registrar
                        </Button>
                        <Button
                          type="button"
                          disabled={!isEditing}
                          className="bg-gray-400 w-full mt-3 hover:bg-gray-300"
                          onClick={() => {
                            setShowCrias(true);
                            setSeleccionActual("crias");
                          }}
                        >
                          Ver crías
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </form>

          <div className=" md:flex hidden justify-center items-stretch px-5">
            <Separator orientation="vertical" className="h-full" />
          </div>

          <div className="flex-1 h-96">
            {seleccionActual === "padre" && <TablaPadre />}

            {seleccionActual === "madre" && <TablaMadre />}

            {seleccionActual === "fecha" && (
              <>
                <h2 className="text-base text-center font-bold mb-4">
                  Seleccionar Fecha de Inicio
                </h2>
                <Card>
                  <CardContent className="p-4 flex justify-center">
                    <Calendar
                      mode="single"
                      disabled={isReproduccionIniciada || isEditing}
                      selected={
                        watch("fechaReproduccion") !== null
                          ? new Date(watch("fechaReproduccion") as Date)
                          : undefined
                      }
                      onSelect={(date) => {
                        setValue("fechaReproduccion", date ?? null);
                      }}
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {showCrias && seleccionActual === "crias" && (
              <>
                <h2 className="text-base font-bold text-center mb-4">
                  Lista de crías
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="max-h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Sexo</TableHead>
                            <TableHead>Peso (Gr)</TableHead>
                            <TableHead>Fecha Registrar</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {crias.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell>{c.id}</TableCell>
                              <TableCell
                                className={
                                  c.sexo === "MACHO"
                                    ? "text-blue-600"
                                    : "text-pink-600"
                                }
                              >
                                {c.sexo}
                              </TableCell>
                              <TableCell>{c.peso}</TableCell>
                              <TableCell>{c.fechaRegistro}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {isEditing && seleccionActual === "lista" && (
              <>
                <h2 className="text-base font-bold text-center mb-4">
                  Cuyes de la java
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-y-auto">
                      {(watch("cuyes") ?? []).length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Sexo</TableHead>
                              <TableHead>Fecha y Hora</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(watch("cuyes") ?? []).map((cuy) => (
                              <TableRow key={cuy.id}>
                                <TableCell>{cuy.id}</TableCell>
                                <TableCell
                                  className={`${
                                    cuy.sexo === "MACHO"
                                      ? "text-blue-600"
                                      : "text-pink-600"
                                  }`}
                                >
                                  {cuy.sexo}
                                </TableCell>
                                <TableCell>
                                  {(() => {
                                    const fechaStr = cuy.fechaRegistro;
                                    const fecha = new Date(fechaStr);

                                    const dia = fecha
                                      .getDate()
                                      .toString()
                                      .padStart(2, "0");
                                    const mes = (fecha.getMonth() + 1)
                                      .toString()
                                      .padStart(2, "0");
                                    const anio = fecha.getFullYear();
                                    const hora = fecha
                                      .getHours()
                                      .toString()
                                      .padStart(2, "0");
                                    const minutos = fecha
                                      .getMinutes()
                                      .toString()
                                      .padStart(2, "0");

                                    return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
                                  })()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-gray-400 text-center p-4">
                          No hay cuyes en esta java.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <div className="flex  justify-between pt-4">
          {categoria !== "REPRODUCCION" && (
            <TimeLine fechaInicio={watch("fechaReproduccion")!} />
          )}
          <div className="flex w-full justify-end">
            {categoria === "REPRODUCCION" ? (
              <>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-2 bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
                    disabled={isSubmitting}
                    onClick={async () => {
                      if (!javaToEdit?.id) return;

                      const form = watch();

                      const payload = {
                        nombre: form.nombre,
                        categoria: form.categoria ?? "",
                        sexo: "NA",
                        fechaReproduccion: form.fechaReproduccion
                          ? form.fechaReproduccion.toISOString().split("T")[0]
                          : "",
                        cantidadHijasHembras: form.hembrasNacidas ?? 0,
                        cantidadHijosMachos: form.machosNacidos ?? 0,
                        cantidadHijosMuertos: form.muertos ?? 0,
                        cuyes: [
                          ...(form.padre ? [{ id: form.padre.id }] : []),
                          ...form.madre.map((m) => ({ id: m.id })),
                        ],
                      };

                      try {
                        setIsSubmitting(true);

                        await updateJavaCuyReproduccion(javaToEdit.id, payload);

                        toast.success("Cambios guardados correctamente");

                        onOpenChange(false);
                        reset();
                      } catch (error) {
                        console.error("Error al guardar cambios:", error);
                        toast.error("No se pudieron guardar los cambios");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    Guardar Cambios
                  </Button>
                )}
                <Button
                  type="button"
                  className={`${
                    isEditing
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={
                    isSubmitting || (!isEditing && !canStartReproduction())
                  }
                  onClick={() => {
                    if (isEditing) {
                      handleSubmitUpdateOnlyCounters();
                    } else {
                      handleFinalSubmit();
                    }
                  }}
                >
                  {isEditing
                    ? "Finalizar Reproducción"
                    : "Iniciar Reproducción"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className={`${
                  isEditing
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={isSubmitting || !canStartReproduction()}
                onClick={handleFinalSubmit}
              >
                Guardar Cambios
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
