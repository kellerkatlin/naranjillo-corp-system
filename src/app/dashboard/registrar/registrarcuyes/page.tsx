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

export default function FormCuy() {
  const [data, setData] = useState<Cuy[]>([]);
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

  const columns: ColumnDef<Cuy>[] = [
    { accessorKey: "id", header: "ID" },

    { accessorKey: "edad", header: "Edad (semanas)" },
    { accessorKey: "categoria", header: "Categoría" },
    { accessorKey: "estado", header: "Estado" },
    {
      accessorKey: "fechaRegistro",
      header: "Fecha de Registro",
      cell: ({ row }) => {
        const fechaStr = row.getValue("fechaRegistro") as string;
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
        onOpenChange={setDialogOpen}
        onSubmit={onSubmit}
        cuy={editItem}
      />
      <CrudToolbar onCreate={() => setDialogOpen(true)} title="Cuy" />
      <CrudTable columns={columns} data={data} />
      <ConfirmAlert
        open={deleteDialogOpen}
        title="Eliminar cuy"
        message={`¿Deseas eliminar el cuy con categoría "${itemToDelete?.categoria}"?`}
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
