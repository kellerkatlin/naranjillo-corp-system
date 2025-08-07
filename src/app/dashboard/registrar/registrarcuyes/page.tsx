"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  createCuy,
  deleteCuy,
  getCuyAvailable,
  updateCuy,
} from "@/services/cuyService";
import { CuyPadre, CuyRequest } from "@/types/cuy";
import { CrudToolbar } from "@/components/shared/CrudToolbar";
import { CrudTable } from "@/components/shared/CrudTable";
import ConfirmAlert from "@/components/shared/ComfirmAlert";
import CuyDialog from "@/components/CuyDialog";

export default function FormCuy() {
  const [data, setData] = useState<CuyPadre[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<CuyPadre | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CuyPadre | null>(null);
  const [isFilteringSinJava, setIsFilteringSinJava] = useState(false);

  const loadData = async () => {
    try {
      const res = await getCuyAvailable();
      setData(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const filteredData = data.filter(
    (item) =>
      item.categoria.toLowerCase().includes(search.toLowerCase()) ||
      item.sexo.toLowerCase().includes(search.toLowerCase()) ||
      item.estado.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnDef<CuyPadre>[] = [
    { accessorKey: "id", header: "ID" },

    {
      accessorKey: "edad",
      header: "Edad (días)",
      cell: ({ row }) => {
        const edad = row.getValue("edad");
        return edad === null || edad === undefined ? (
          <span className="text-red-500">Sin asignar</span>
        ) : (
          edad
        );
      },
    },
    { accessorKey: "categoria", header: "Categoría" },
    { accessorKey: "sexo", header: "Sexo" },
    {
      accessorKey: "nombreJavaOrigen",
      header: "Java",
      cell: ({ row }) => {
        const item = row.original;
        return item.nombreJavaOrigen && item.nombreJavaOrigen ? (
          item.nombreJavaOrigen
        ) : (
          <span className="text-red-500">Sin asignar</span>
        );
      },
    },
    {
      accessorKey: "fechaRegistro",
      header: "Fecha de Registro",
      cell: ({ row }) => {
        const fechaStr = row.getValue("fechaRegistro") as string;
        const fecha = new Date(fechaStr);

        const dia = fecha.getDate().toString().padStart(2, "0");
        const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const anio = fecha.getFullYear();
        const hora = fecha.getHours().toString().padStart(2, "0");
        const minutos = fecha.getMinutes().toString().padStart(2, "0");

        return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
      },
    },

    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
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
              size="sm"
              className="cursor-pointer"
              variant="destructive"
              onClick={() => {
                setItemToDelete(item);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const onSubmit = async (form: CuyRequest) => {
    try {
      if (editItem) {
        await updateCuy(editItem.id, form);
        toast.success("Cuy actualizado");
      } else {
        await createCuy(form);
        toast.success("Cuy registrado");
        await loadData()
      }

      // if (isFilteringSinJava) {
      //   const cuyesSinJava = await getCuyesSinJava();
      //   setData(cuyesSinJava);
      // } else {
      //   await loadData();
      // }

      setDialogOpen(false);
      setEditItem(null);
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCuy(id);
      setData((prev) => prev.filter((item) => item.id !== id));

      toast.success("Cuy eliminado");
      await loadData();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <>
      <CuyDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditItem(null);
        }}
        onSubmit={onSubmit}
        cuy={editItem}
      />

      <CrudToolbar
        setSearch={setSearch}
        onCreate={() => setDialogOpen(true)}
        title="Cuy"
        isFilteringSinJava={isFilteringSinJava}
        onToggleJavaFilter={async () => {
          try {
            if (isFilteringSinJava) {
              await loadData();
              setIsFilteringSinJava(false);
            } else {
              // const cuyesSinJava = await getCuyesSinJava();
              // setData(cuyesSinJava);
              setIsFilteringSinJava(true);
            }
          } catch {
            toast.error("Error al cargar cuyes");
          }
        }}
      />

      <CrudTable columns={columns} data={filteredData} />
      <ConfirmAlert
        open={deleteDialogOpen}
        title="Eliminar cuy"
        message={`¿Deseas eliminar el cuy con categoría "${itemToDelete?.id}"?`}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={async () => {
          if (itemToDelete) {
            await handleDelete(itemToDelete.id);
            setDeleteDialogOpen(false);
            setItemToDelete(null);
          }
        }}
      />
    </>
  );
}
