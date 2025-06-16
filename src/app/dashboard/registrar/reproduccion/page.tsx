"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAllJava,
  createJavaCuy,
  createJavaCuyReproduccion,
  getAllJavaByCategoria,
} from "@/services/javaService";
import { JavaRespose } from "@/types/java";
import { Card, CardContent } from "@/components/ui/card";
import CardJava from "@/components/CardJava";
import { Plus } from "lucide-react";
import JavaGrupoDialog, { DataJava } from "@/components/JavaGrupoDialog";

import { Button } from "@/components/ui/button";

export default function FormReproduccion() {
  const [javasMachos, setJavasMachos] = useState<JavaRespose[]>([]);
  const [javasHembras, setJavasHembras] = useState<JavaRespose[]>([]);
  const [javasReproduccion, setJavasReproduccion] = useState<JavaRespose[]>([]);

  const [filtroMacho, setFiltroMacho] = useState("TODOS");
  const [filtroHembra, setFiltroHembra] = useState("TODOS");
  const [dialogGrupoOpen, setDialogGrupoOpen] = useState<
    false | "REPRODUCCION" | "MACHO" | "HEMBRA"
  >(false);

  useEffect(() => {
    fetchMachos();
    fetchHembras();
    fetchReproduccion();
  }, []);

  useEffect(() => {
    fetchMachos();
  }, [filtroMacho]);

  useEffect(() => {
    fetchHembras();
  }, [filtroHembra]);

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

  const handleSubmitJava = async (form: DataJava) => {
    try {
      if (form.categoria === "REPRODUCCION") {
        await createJavaCuyReproduccion({
          nombre: form.nombre,
          categoria: form.categoria,
          sexo: "NA",
          fechaReproduccion:
            form.fechaInicio?.toISOString().split("T")[0] ?? "",
          cantidadHijasHembras: form.hembrasNacidas ?? 0,
          cantidadHijosMachos: form.machosNacidos ?? 0,
          cantidadHijosMuertos: form.muertos ?? 0,
          cuyes: form.madre.map((m) => ({ id: m.id })),
        });
        toast.success("Java de reproducción creado");
      } else {
        await createJavaCuy({
          nombre: form.nombre,
          categoria: form.categoria ?? "",
          sexo: form.sexo ?? "",
          fechaReproduccion:
            form.fechaInicio?.toISOString().split("T")[0] ?? "",
        });

        // Refresca según el sexo
        if (form.sexo === "MACHO") {
          fetchMachos();
        } else {
          fetchHembras();
        }
        toast.success("Java creado");
      }
      setDialogGrupoOpen(false);
    } catch {
      toast.error("Error al crear Java");
    }
  };

  return (
    <div className="p-4 rounded-lg">
      {/* GRUPO REPRODUCCION */}
      <Card className="p-3 mb-6">
        <div>
          <span className="bg-orange-400 text-white px-4 py-1 rounded-md font-semibold inline-block text-center">
            Grupo Reproducción
          </span>
        </div>
        {/* CARRUSEL */}
        <div className="flex  gap-4">
          {javasReproduccion.map((grupo) => (
            <CardJava key={grupo.id} java={grupo} />
          ))}
          <Card className="w-36 h-36 border-green-400 border-2 cursor-pointer hover:scale-105 transition">
            <CardContent
              onClick={() => setDialogGrupoOpen("HEMBRA")}
              className="p-2 flex flex-col items-center justify-center"
            >
              <Plus className="w-8 h-8 text-green-400" />
              <div className="mt-2 font-semibold text-green-400">
                CREAR JAVA
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>

      {/* GRUPO MACHOS */}
      <Card className="p-3 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
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
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* CARRUSEL */}
        <div className="flex  gap-4">
          {javasMachos.map((grupo) => (
            <CardJava key={grupo.id} java={grupo} />
          ))}
          <Card className="w-36 h-36 border-green-400 border-2 cursor-pointer hover:scale-105 transition">
            <CardContent
              onClick={() => setDialogGrupoOpen("HEMBRA")}
              className="p-2 flex flex-col items-center justify-center"
            >
              <Plus className="w-8 h-8 text-green-400" />
              <div className="mt-2 font-semibold text-green-400">
                CREAR JAVA
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>

      {/* GRUPO HEMBRAS */}
      <Card className="p-3 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
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
                {cat}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex  gap-4">
          {javasHembras.map((grupo) => (
            <CardJava key={grupo.id} java={grupo} />
          ))}
          <Card className="w-36 h-36 border-green-400 border-2 cursor-pointer hover:scale-105 transition">
            <CardContent
              onClick={() => setDialogGrupoOpen("HEMBRA")}
              className="p-2 flex flex-col items-center justify-center"
            >
              <Plus className="w-8 h-8 text-green-400" />
              <div className="mt-2 font-semibold text-green-400">
                CREAR JAVA
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>

      <JavaGrupoDialog
        open={dialogGrupoOpen !== false}
        onOpenChange={(open) => !open && setDialogGrupoOpen(false)}
        mode={dialogGrupoOpen === false ? "REPRODUCCION" : dialogGrupoOpen}
        onSubmit={handleSubmitJava}
      />
    </div>
  );
}
