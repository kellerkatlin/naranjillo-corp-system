"use client";

import { Button } from "@/components/ui/button";
import {
  createAlimentacion,
  deleteAlimentacion,
  getAllAlimentaciones,
  updateAlimentacion,
} from "@/services/alimentacionService";
import { Alimentacion, AlimentacionRequest } from "@/types/alimentacion";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import AlimentacionDialog from "@/components/AlimentacionDialog";
import { toast } from "sonner";
import { CrudToolbar } from "@/components/shared/CrudToolbar";
import { CrudTable } from "@/components/shared/CrudTable";
import ConfirmAlert from "@/components/shared/ComfirmAlert";

export default function FormAlimentacion() {
  const [data, setData] = useState<Alimentacion[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Alimentacion | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Alimentacion | null>(null);

  const loadData = async () => {
    try {
      const res = await getAllAlimentaciones();

      setData(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: ColumnDef<Alimentacion>[] = [
    { accessorKey: "tipoAlimento", header: "Tipo" },
    { accessorKey: "cantidad", header: "Cantidad" },
    {
      accessorKey: "fechaAlimentacion",
      header: "Fecha",
      cell: ({ row }) => {
        const fechaStr = row.getValue("fechaAlimentacion") as string;
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
              size="sm"
              onClick={() => {
                setEditItem(item);
                setDialogOpen(true);
              }}
            >
              <Pencil className="w-4 h-4 " />
            </Button>
            <Button
              size="sm"
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

  const onSubmit = async (form: AlimentacionRequest) => {
    try {
      if (editItem) {
        const updated = await updateAlimentacion(editItem.id, form);
        setData((prev) =>
          prev.map((item) => (item.id === editItem.id ? updated : item))
        );
        toast.success("Actualizado");
      } else {
        const created = await createAlimentacion(form);
        setData((prev) => [...prev, created]);
        toast.success("Registrado");
      }
      setDialogOpen(false);
      setEditItem(null);
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAlimentacion(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <>
      <AlimentacionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={onSubmit}
        alimentacion={editItem}
      />
      <CrudToolbar onCreate={() => setDialogOpen(true)} title="Alimentación" />
      <CrudTable columns={columns} data={data} />
      <ConfirmAlert
        open={deleteDialogOpen}
        title="Eliminar registro"
        message={`¿Deseas eliminar "${itemToDelete?.tipoAlimento}"?`}
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
