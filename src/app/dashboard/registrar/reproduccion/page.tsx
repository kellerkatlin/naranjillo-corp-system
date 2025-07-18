"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAllJava,
  createJavaCuy,
  createJavaCuyReproduccion,
  getAllJavaByCategoria,
  finalizarJavaCuy,
  updateJavaCuy,
} from "@/services/javaService";
import { JavaRespose } from "@/types/java";
import { Card, CardContent } from "@/components/ui/card";
import CardJava from "@/components/CardJava";
import { Plus } from "lucide-react";
import JavaGrupoDialog, { DataJava } from "@/components/JavaGrupoDialog";

import { Button } from "@/components/ui/button";
import { useMessageStore } from "@/store/messageStore";

export default function FormReproduccion() {
  const [javasMachos, setJavasMachos] = useState<JavaRespose[]>([]);
  const [javasHembras, setJavasHembras] = useState<JavaRespose[]>([]);
  const [javasReproduccion, setJavasReproduccion] = useState<JavaRespose[]>([]);
  const [javaToEdit, setJavaToEdit] = useState<DataJava | undefined>(undefined);
  const [filtroMacho, setFiltroMacho] = useState("TODOS");
  const [filtroHembra, setFiltroHembra] = useState("TODOS");
  const [dialogGrupoOpen, setDialogGrupoOpen] = useState<
    false | "REPRODUCCION" | "MACHO" | "HEMBRA"
  >(false);

  useEffect(() => {
    fetchMachos();
  }, [filtroMacho]);

  useEffect(() => {
    fetchHembras();
  }, [filtroHembra]);

  useEffect(() => {
    fetchMachos();
    fetchHembras();
    fetchReproduccion();
  }, [dialogGrupoOpen]);

  const fetchMachos = async () => {
    try {
      const res = await getAllJava("MACHO", filtroMacho);
      setJavasMachos(res);
    } catch {
      toast.error("Error al cargar machos");
    }
  };

  const fetchReproduccion = async () => {
    try {
      const res = await getAllJavaByCategoria("REPRODUCCION");
      setJavasReproduccion(res);
    } catch {
      toast.error("Error al cargar javas de reproducción");
    }
  };

  const fetchHembras = async () => {
    try {
      const res = await getAllJava("HEMBRA", filtroHembra);
      setJavasHembras(res);
    } catch {
      toast.error("Error al cargar hembras");
    }
  };

  const handleSubmitCreate = async (form: DataJava) => {
    try {
      if (form.categoria === "REPRODUCCION") {
        await createJavaCuyReproduccion({
          nombre: form.nombre,
          categoria: form.categoria,
          sexo: "NA",
          fechaReproduccion:
            form.fechaReproduccion?.toISOString().split("T")[0] ?? "",
          cantidadHijasHembras: form.hembrasNacidas ?? 0,
          cantidadHijosMachos: form.machosNacidos ?? 0,
          cantidadHijosMuertos: form.muertos ?? 0,
          cuyes: [
            ...(form.padre ? [{ id: form.padre.id }] : []),
            ...form.madre.map((m) => ({ id: m.id })),
          ],
        });
        await useMessageStore.getState().fetchMessages();
        await fetchReproduccion();
        toast.success("Java de reproducción creado");
      } else {
        await createJavaCuy({
          nombre: form.nombre,
          categoria: form.categoria ?? "",
          sexo: form.sexo ?? "",
          fechaReproduccion:
            form.fechaReproduccion?.toISOString().split("T")[0] ?? "",
        });
        await useMessageStore.getState().fetchMessages();
        if (form.sexo === "MACHO") {
          fetchMachos();
        } else {
          fetchHembras();
        }
        toast.success("Java creado");
      }
      cerrarDialog();
    } catch {
      toast.error("Error al crear Java");
    }
  };

  const handleSubmitUpdateCuy = async (form: DataJava) => {
    try {
      await updateJavaCuy(form.id ?? 0, {
        nombre: form.nombre,
        categoria: form.categoria ?? "",
        sexo: form.sexo ?? "",
        fechaReproduccion:
          form.fechaReproduccion?.toISOString().split("T")[0] ?? "",
        cantidadHijasHembras: form.hembrasNacidas ?? 0,
        cantidadHijosMachos: form.machosNacidos ?? 0,
        cantidadHijosMuertos: form.muertos ?? 0,
        cuyes: [
          ...(form.padre ? [{ id: form.padre.id }] : []),
          ...form.madre.map((m) => ({ id: m.id })),
        ],
      });
      await fetchReproduccion();
      await useMessageStore.getState().fetchMessages();
      toast.success("Reproducción actualizada");
      cerrarDialog();
    } catch {
      toast.error("Error al actualizar reproducción");
    }
  };
  const handleSubmitUpdate = async (form: DataJava) => {
    try {
      await finalizarJavaCuy(form.id ?? 0, {
        nombre: form.nombre,
        categoria: form.categoria ?? "",
        sexo: "NA",
        fechaReproduccion:
          form.fechaReproduccion?.toISOString().split("T")[0] ?? "",
        cantidadHijasHembras: form.hembrasNacidas ?? 0,
        cantidadHijosMachos: form.machosNacidos ?? 0,
        cantidadHijosMuertos: form.muertos ?? 0,
        cuyes: [
          ...(form.padre ? [{ id: form.padre.id }] : []),
          ...form.madre.map((m) => ({ id: m.id })),
        ],
      });
      await fetchReproduccion();
      await useMessageStore.getState().fetchMessages();
      toast.success("Reproducción actualizada");
      cerrarDialog();
    } catch {
      toast.error("Error al actualizar reproducción");
    }
  };
  const cerrarDialog = () => {
    setDialogGrupoOpen(false);
    setJavaToEdit(undefined);
  };

  return (
    <div className="p-4 rounded-lg">
      {/* GRUPO REPRODUCCION */}
      <Card className="px-3 mb-3 ">
        <div>
          <span className="bg-orange-400 text-white px-4 py-1 rounded-md font-semibold inline-block text-center">
            Grupo Reproducción
          </span>
        </div>

        <div className="flex gap-4  -mt-4">
          {/* Contenedor scrollable solo para las cards */}
          <div className="flex-shrink-0 w-36 mt-8 h-36 flex items-center justify-center border-green-400 border-2 cursor-pointer hover:scale-105 transition">
            <CardContent
              onClick={() => setDialogGrupoOpen("REPRODUCCION")}
              className="p-2 flex flex-col items-center justify-center"
            >
              <Plus className="w-8 h-8 text-green-400" />
              <div className="mt-2 text-xs text-center font-semibold text-green-400">
                CREAR REPRODUCCIÓN
              </div>
            </CardContent>
          </div>

          <div className="flex gap-4 py-8 overflow-x-auto overflow-y-hidden ">
            {javasReproduccion.map((grupo) => (
              <div
                key={grupo.id}
                className="flex-shrink-0 overflow-visible max-w-md hover:scale-105"
              >
                <CardJava
                  java={grupo}
                  imagen={true}
                  onClickEdit={() => {
                    const padre =
                      grupo.cuyes?.find((c) => c.sexo === "MACHO") ?? null;
                    const madres =
                      grupo.cuyes?.filter((c) => c.sexo === "HEMBRA") ?? [];
                    const [y, m, d] = grupo.fechaReproduccion
                      .split("-")
                      .map(Number);
                    const fechaLocal = new Date(y, m - 1, d); // año, mesIndexado(0–11), día

                    setJavaToEdit({
                      id: grupo.id,
                      nombre: grupo.nombre,
                      categoria: grupo.categoria,
                      fechaReproduccion: fechaLocal,
                      hembrasNacidas: grupo.cantidadHijasHembras,
                      sexo: grupo.sexo,
                      cuyes: grupo.cuyes,
                      machosNacidos: grupo.cantidadHijosMachos,
                      muertos: grupo.cantidadHijosMuertos,
                      padre: padre
                        ? {
                            id: padre.id,
                            sexo: padre.sexo,
                            categoria: padre.categoria,
                            edad: 0,
                            nombreJavaOrigen: padre.nombreJavaOrigen,
                            estado: "ACTIVO",
                            fechaRegistro: padre.fechaRegistro,
                            horaRegistro: padre.fechaRegistro,
                            nombre: padre.nombre,
                            java: "",
                          }
                        : null,
                      madre: madres.map((m) => ({
                        id: m.id,
                        sexo: m.sexo,
                        nombre: m.nombre,
                        edad: 0,
                        nombreJavaOrigen: m.nombreJavaOrigen,
                        fechaRegistro: m.fechaRegistro,
                        horaRegistro: m.fechaRegistro,
                        categoria: m.categoria ?? "",
                        estado: "ACTIVO",
                        java: "",
                      })),

                      regiones: {},
                    });
                    setDialogGrupoOpen("REPRODUCCION");
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* GRUPO MACHOS */}
      <Card className="px-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {["TODOS", "ENGORDE", "CRIA"].map((cat) => (
              <Button
                key={cat}
                className={`${
                  filtroMacho === cat
                    ? "bg-orange-400 text-white"
                    : "bg-blue-300 text-white"
                }`}
                onClick={() => setFiltroMacho(cat)}
              >
                {cat === "TODOS" ? "TODOS CUYES MACHOS" : cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 -mt-4 ">
          {/* Contenedor scrollable solo para las cards */}
          <div className="flex-shrink-0 w-36 h-36 mt-8 border-green-400 border-2 flex items-center justify-center cursor-pointer hover:scale-105 transition">
            <CardContent
              onClick={() => setDialogGrupoOpen("MACHO")}
              className="p-2 flex flex-col items-center justify-center"
            >
              <Plus className="w-8 h-8 text-green-400" />
              <div className="mt-2 text-xs text-center font-semibold text-green-400">
                CREAR JAVA MACHO
              </div>
            </CardContent>
          </div>
          <div className="flex gap-4 py-8 overflow-x-auto overflow-y-hidden">
            {javasMachos.map((grupo) => (
              <div
                key={grupo.id}
                className="flex-shrink-0 overflow-visible max-w-md hover:scale-105"
              >
                <CardJava
                  java={grupo}
                  onClickEdit={() => {
                    const padre =
                      grupo.cuyes?.find((c) => c.sexo === "MACHO") ?? null;
                    const madres =
                      grupo.cuyes?.filter((c) => c.sexo === "HEMBRA") ?? [];
                    const [y, m, d] = grupo.fechaReproduccion
                      .split("-")
                      .map(Number);
                    const fechaLocal = new Date(y, m - 1, d); // año, mesIndexado(0–11), día

                    setJavaToEdit({
                      id: grupo.id,
                      nombre: grupo.nombre,
                      categoria: grupo.categoria,
                      fechaReproduccion: fechaLocal,
                      hembrasNacidas: grupo.cantidadHijasHembras,
                      sexo: grupo.sexo,
                      cuyes: grupo.cuyes,
                      machosNacidos: grupo.cantidadHijosMachos,
                      muertos: grupo.cantidadHijosMuertos,
                      padre: padre
                        ? {
                            id: padre.id,
                            sexo: padre.sexo,
                            categoria: padre.categoria,
                            edad: 0,
                            estado: "ACTIVO",
                            fechaRegistro: padre.fechaRegistro,
                            horaRegistro: padre.fechaRegistro,
                            nombre: padre.nombre,
                            nombreJavaOrigen: padre.nombreJavaOrigen,
                            java: "",
                          }
                        : null,
                      madre: madres.map((m) => ({
                        id: m.id,
                        sexo: m.sexo,
                        nombre: m.nombre,
                        edad: 0,
                        fechaRegistro: m.fechaRegistro,
                        nombreJavaOrigen: m.nombreJavaOrigen,
                        horaRegistro: m.fechaRegistro,
                        categoria: m.categoria ?? "",
                        estado: "ACTIVO",
                        java: "",
                      })),
                      regiones: {},
                    });
                    setDialogGrupoOpen("MACHO");
                  }}
                />
              </div>
            ))}
          </div>

          {/* Botón fijo fuera del scroll */}
        </div>
      </Card>

      {/* GRUPO HEMBRAS */}

      <Card className="px-3">
        <div className="flex items-center justify-between ">
          <div className="flex flex-wrap gap-2">
            {["TODOS", "ENGORDE", "CRIA"].map((cat) => (
              <Button
                key={cat}
                className={`${
                  filtroHembra === cat
                    ? "bg-orange-400 text-white"
                    : "bg-blue-300 text-white"
                }`}
                variant={filtroHembra === cat ? "default" : "outline"}
                onClick={() => setFiltroHembra(cat)}
              >
                {cat === "TODOS" ? "TODOS CUYES HEMBRAS" : cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-4  -mt-4">
          {/* Scroll horizontal para las cards */}
          <div className="flex-shrink-0 w-36 h-36 flex mt-8  items-center justify-center border-green-400 border-2 cursor-pointer hover:scale-105 transition">
            <CardContent
              onClick={() => setDialogGrupoOpen("HEMBRA")}
              className="p-2 flex flex-col  items-center justify-center"
            >
              <Plus className="w-8 h-8 text-green-400" />
              <div className="mt-2 text-xs text-center font-semibold text-green-400">
                CREAR JAVA HEMBRA
              </div>
            </CardContent>
          </div>
          <div className="flex gap-4  py-8  overflow-x-auto flex-1">
            {javasHembras.map((grupo) => (
              <div key={grupo.id} className="flex-shrink-0 max-w-md">
                <CardJava
                  java={grupo}
                  onClickEdit={() => {
                    const padre =
                      grupo.cuyes?.find((c) => c.sexo === "MACHO") ?? null;
                    const madres =
                      grupo.cuyes?.filter((c) => c.sexo === "HEMBRA") ?? [];
                    const [y, m, d] = grupo.fechaReproduccion
                      .split("-")
                      .map(Number);
                    const fechaLocal = new Date(y, m - 1, d); // año, mesIndexado(0–11), día

                    setJavaToEdit({
                      id: grupo.id,
                      nombre: grupo.nombre,
                      categoria: grupo.categoria,
                      fechaReproduccion: fechaLocal,
                      sexo: grupo.sexo,
                      hembrasNacidas: grupo.cantidadHijasHembras,
                      machosNacidos: grupo.cantidadHijosMachos,
                      muertos: grupo.cantidadHijosMuertos,
                      padre: padre
                        ? {
                            id: padre.id,
                            sexo: padre.sexo,
                            nombreJavaOrigen: padre.nombreJavaOrigen,
                            categoria: padre.categoria,
                            edad: 0,
                            estado: "ACTIVO",
                            fechaRegistro: padre.fechaRegistro,
                            horaRegistro: padre.fechaRegistro,
                            nombre: padre.nombre,
                            java: "",
                          }
                        : null,
                      madre: madres.map((m) => ({
                        id: m.id,
                        sexo: m.sexo,
                        nombre: m.nombre,
                        edad: 0,
                        nombreJavaOrigen: m.nombreJavaOrigen,
                        fechaRegistro: m.fechaRegistro,
                        horaRegistro: m.fechaRegistro,
                        categoria: m.categoria ?? "",
                        estado: "ACTIVO",
                        java: "",
                      })),
                      cuyes: grupo.cuyes,
                      regiones: {},
                    });

                    setDialogGrupoOpen("HEMBRA");
                  }}
                />
              </div>
            ))}
          </div>

          {/* Botón fuera del scroll */}
        </div>
      </Card>

      <JavaGrupoDialog
        open={dialogGrupoOpen !== false}
        onOpenChange={(open) => {
          if (!open) cerrarDialog();
        }}
        mode={dialogGrupoOpen === false ? "REPRODUCCION" : dialogGrupoOpen}
        onSubmitCreate={handleSubmitCreate}
        onSubmitUpdate={handleSubmitUpdate}
        onSubmitUpdateCuy={handleSubmitUpdateCuy}
        javaToEdit={javaToEdit}
      />
    </div>
  );
}
