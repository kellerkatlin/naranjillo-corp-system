"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Reproduccion, ReproduccionRequest } from "@/types/reproduccion";
import {
  createJavaCuy,
  createJavaCuyReproduccion,
  createReproduccion,
  deleteReproduccion,
  getAllReproducciones,
  updateReproduccion,
} from "@/services/javaService";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import ReproduccionDialog from "@/components/ReproduccionDialog";
import { CrudToolbar } from "@/components/shared/CrudToolbar";
import { CrudTable } from "@/components/shared/CrudTable";
import ConfirmAlert from "@/components/shared/ComfirmAlert";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import CardJava from "@/components/CardJava";
import JavaGrupoDialog, { DataJava } from "@/components/JavaGrupoDialog";
import { JavaRequest, JavaRequestReproduccion } from "@/types/java";

export default function FormReproduccion() {
  const [data, setData] = useState<Reproduccion[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogGrupoOpen, setDialogGrupoOpen] = useState<
    false | "REPRODUCCION" | "MACHO" | "HEMBRA"
  >(false);

  const [editItem, setEditItem] = useState<Reproduccion | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Reproduccion | null>(null);
  const [viewItem, setViewItem] = useState<Reproduccion | null>(null);

  const loadData = async () => {
    try {
      const res = await getAllReproducciones();
      setData(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: ColumnDef<Reproduccion>[] = [
    {
      accessorKey: "nombreCuyera",
      header: "Nombre Cuyera",
    },
    {
      accessorKey: "cantidadHijos",
      header: "Cantidad de Hijos",
    },
    {
      accessorKey: "fechaReproduccion",
      header: "Fecha Reproducción",
      cell: ({ row }) => {
        const fechaStr = row.getValue("fechaReproduccion") as string;
        const [year, month, day] = fechaStr.split("-");
        return new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        ).toLocaleDateString();
      },
    },
    {
      accessorKey: "fechaParto",
      header: "Fecha Parto",
      cell: ({ row }) => {
        const fechaStr = row.getValue("fechaParto") as string;
        const [year, month, day] = fechaStr.split("-");
        return new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        ).toLocaleDateString();
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              size="sm"
              onClick={() => {
                setEditItem(item);
                setDialogOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              className="cursor-pointer"
              size="sm"
              variant="destructive"
              onClick={() => {
                setItemToDelete(item);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              className="cursor-pointer"
              size="sm"
              variant="secondary"
              onClick={() => setViewItem(item)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const onSubmit = async (form: ReproduccionRequest) => {
    try {
      if (editItem) {
        const updated = await updateReproduccion(editItem.id, form);
        setData((prev) =>
          prev.map((item) => (item.id === editItem.id ? updated : item))
        );
        toast.success("Actualizado");
      } else {
        const created = await createReproduccion(form);
        setData((prev) => [...prev, created]);
        toast.success("Registrado");
      }
      setDialogOpen(false);
      setEditItem(null);
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleSubmitJava = (form: DataJava) => {
    if (form.categoria === "REPRODUCCION") {
      const request: JavaRequestReproduccion = {
        nombre: form.nombre,
        categoria: form.categoria,
        sexo: "NA",
        fechaReproduccion: form.fechaInicio?.toISOString().split("T")[0] ?? "",
        cantidadHijasHembras: form.hembrasNacidas ?? 0,
        cantidadHijosMachos: form.machosNacidos ?? 0,
        cantidadHijosMuertos: form.muertos ?? 0,
        cuyes: form.madre.map((m) => ({ id: m.id })),
      };

      createJavaCuyReproduccion(request);
    } else {
      const request: JavaRequest = {
        nombre: form.nombre,
        categoria: form.categoria ?? "",
        sexo: form.sexo ?? "",
        fechaReproduccion: form.fechaInicio?.toISOString().split("T")[0] ?? "",
      };

      createJavaCuy(request);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReproduccion(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const grupos = [
    { nombre: "AMAZONAS", dias: 14 },
    { nombre: "PASCO", dias: 15 },
    { nombre: "MADRE DE DIOS", dias: 16 },
    { nombre: "LORETO", dias: 16 },
  ];

  return (
    <div className="p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <Card className="flex p-3  flex-wrap">
          <div className="mb-4">
            <span className="bg-orange-400 text-white px-4 py-1 rounded-md font-semibold">
              Grupo Reproducción
            </span>
          </div>
          <div className="flex flex-wrap space-x-4 space-y-4 pl-4">
            {grupos.map((grupo, idx) => (
              <CardJava key={idx} java={grupo} />
            ))}
            <Card className="w-36 h-36 border-green-400 border-2 cursor-pointer hover:scale-105 transition">
              <CardContent
                onClick={() => setDialogGrupoOpen("REPRODUCCION")}
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
        <Card className="flex p-3  flex-wrap">
          <div className="mb-4">
            <span className="bg-orange-400 text-white px-4 py-1 rounded-md font-semibold">
              Todos los Machos
            </span>
          </div>
          <div className="flex flex-wrap space-x-4 space-y-4 pl-4">
            {grupos.map((grupo, idx) => (
              <CardJava key={idx} java={grupo} />
            ))}
            <Card className="w-36 h-36 border-green-400 border-2 cursor-pointer hover:scale-105 transition">
              <CardContent
                onClick={() => setDialogGrupoOpen("MACHO")}
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
        <Card className="flex p-3  flex-wrap">
          <div className="mb-4">
            <span className="bg-orange-400 text-white px-4 py-1 rounded-md font-semibold">
              Todas las Hembras
            </span>
          </div>
          <div className="flex flex-wrap space-x-4 space-y-4 pl-4">
            {grupos.map((grupo, idx) => (
              <CardJava key={idx} java={grupo} />
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
      </div>
      <JavaGrupoDialog
        open={dialogGrupoOpen !== false}
        onOpenChange={(open) => {
          if (!open) setDialogGrupoOpen(false);
        }}
        mode={dialogGrupoOpen === false ? "REPRODUCCION" : dialogGrupoOpen}
        onSubmit={handleSubmitJava}
      />
    </div>
  );
}
