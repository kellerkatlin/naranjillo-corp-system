"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  createCuy,
  deleteCuy,
  getAllCuyes,
  updateCuy,
} from "@/services/cuyService";
import { Cuy, CuyRequest } from "@/types/cuy";
import { CrudToolbar } from "@/components/shared/CrudToolbar";
import { CrudTable } from "@/components/shared/CrudTable";
import ConfirmAlert from "@/components/shared/ComfirmAlert";
import CuyDialog from "@/components/CuyDialog";
import { getCuyesSinJava } from "@/services/javaService";

export default function FormCuy() {
  const [data, setData] = useState<Cuy[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Cuy | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Cuy | null>(null);

  const loadData = async () => {
    try {
      const res = await getAllCuyes();
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

  const columns: ColumnDef<Cuy>[] = [
    { accessorKey: "id", header: "ID" },

    { accessorKey: "edad", header: "Edad (semanas)" },
    { accessorKey: "categoria", header: "Categoría" },
    { accessorKey: "sexo", header: "Sexo" },
    { accessorKey: "estado", header: "Estado" },
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
        const updated = await updateCuy(editItem.id, form);
        setData((prev) =>
          prev.map((item) => (item.id === editItem.id ? updated : item))
        );
        toast.success("Cuy actualizado");
      } else {
        const created = await createCuy(form);
        setData((prev) => [...prev, created]);
        toast.success("Cuy registrado");
      }
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
        onLoadWithoutJava={async () => {
          try {
            const cuyesSinJava = await getCuyesSinJava();
            setData(cuyesSinJava);
            toast.success("Cuyes sin Java cargados");
          } catch {
            toast.error("Error al cargar cuyes sin Java");
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
