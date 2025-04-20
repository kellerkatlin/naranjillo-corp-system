"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Reproduccion, ReproduccionRequest } from "@/types/reproduccion";
import {
  createReproduccion,
  deleteReproduccion,
  getAllReproducciones,
  updateReproduccion,
} from "@/services/reproduccionService";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import ReproduccionDialog from "@/components/ReproduccionDialog";
import { CrudToolbar } from "@/components/shared/CrudToolbar";
import { CrudTable } from "@/components/shared/CrudTable";
import ConfirmAlert from "@/components/shared/ComfirmAlert";

export default function FormReproduccion() {
  const [data, setData] = useState<Reproduccion[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const handleDelete = async (id: number) => {
    try {
      await deleteReproduccion(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };
  return (
    <>
      <ReproduccionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={onSubmit}
        reproduccion={editItem}
      />

      <ReproduccionDialog
        open={!!viewItem}
        onOpenChange={(open) => {
          if (!open) setViewItem(null);
        }}
        onSubmit={() => {}}
        reproduccion={viewItem}
        readOnly
      />

      <CrudToolbar onCreate={() => setDialogOpen(true)} title="Reproducción" />
      <CrudTable columns={columns} data={data} />
      <ConfirmAlert
        open={deleteDialogOpen}
        title="Eliminar registro"
        message={`¿Deseas eliminar "${itemToDelete?.id}"?`}
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
