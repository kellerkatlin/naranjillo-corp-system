"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import {
  getAllSanidades,
  createSanidad,
  updateSanidad,
  deleteSanidad,
} from "@/services/sanidadService";
import { Sanidad, SanidadRequest } from "@/types/sanidad";

import SanidadDialog from "@/components/SanidadDialog";
import ConfirmAlert from "@/components/shared/ComfirmAlert";
import { CrudToolbar } from "@/components/shared/CrudToolbar";
import { CrudTable } from "@/components/shared/CrudTable";

export default function FormSanidad() {
  const [data, setData] = useState<Sanidad[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Sanidad | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Sanidad | null>(null);

  const loadData = async () => {
    try {
      const res = await getAllSanidades();
      setData(res);
    } catch {
      toast.error("Error al cargar sanidad");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: ColumnDef<Sanidad>[] = [
    { accessorKey: "tipoMedicina", header: "Tipo de medicina" },
    { accessorKey: "incidencia", header: "Incidencia" },
    { accessorKey: "comentario", header: "Comentario" },
    { accessorKey: "unidadSuministro", header: "Unidad de medida" },
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => {
        const fechaStr = row.getValue("fecha") as string;
        const [y, m, d] = fechaStr.split("-");
        return new Date(+y, +m - 1, +d).toLocaleDateString();
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
              <Pencil className="w-4 h-4" />
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

  const onSubmit = async (form: SanidadRequest) => {
    try {
      if (editItem) {
        const updated = await updateSanidad(editItem.id, form);
        setData((prev) =>
          prev.map((item) => (item.id === editItem.id ? updated : item))
        );
        toast.success("Actualizado");
      } else {
        const created = await createSanidad(form);
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
      await deleteSanidad(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <>
      <SanidadDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditItem(null);
        }}
        onSubmit={onSubmit}
        sanidad={editItem}
      />

      <CrudToolbar onCreate={() => setDialogOpen(true)} title="Sanidad" />
      <CrudTable columns={columns} data={data} />
      <ConfirmAlert
        open={deleteDialogOpen}
        title="Eliminar sanidad"
        message={`¿Deseas eliminar el registro de "${itemToDelete?.tipoMedicina}"?`}
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
