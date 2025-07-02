"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import {
  getAllSanidades,
  createSanidad,
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
  const [cuyId, setCuyId] = useState<number | null>(null);
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
    {
      accessorKey: "fechaYHora",
      header: "Fecha",
      cell: ({ row }) => {
        const fechaStr = row.getValue("fechaYHora") as string;
        if (!fechaStr) return "Sin fecha";

        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "fechaYHora",
      header: "Hora",
      cell: ({ row }) => {
        const fechaStr = row.getValue("fechaYHora") as string;
        if (!fechaStr) return "Sin hora";

        const fecha = new Date(fechaStr);
        return fecha.toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // si deseas formato 24 horas
        });
      },
    },
    { accessorKey: "java", header: "Java" },
    { accessorKey: "cuy.id", header: "Id Cuy" },
    { accessorKey: "costo", header: "Costo" },
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
                setCuyId(item.cuy.id);
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

  const dataUnicaPorCuy: Sanidad[] = Object.values(
    data.reduce((acc, item) => {
      const cuyId = item.cuy?.id;
      if (!cuyId) return acc;

      if (!acc[cuyId]) {
        acc[cuyId] = { ...item };
      } else {
        acc[cuyId].costo += item.costo;
      }

      return acc;
    }, {} as Record<number, Sanidad>)
  );

  const onSubmit = async (form: SanidadRequest) => {
    try {
      await createSanidad(form);
      await loadData();
      toast.success("Registrado");
      setDialogOpen(false);
      setCuyId(null);
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSanidad(id);
      await loadData();
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
        }}
        onSubmit={onSubmit}
        cuyId={cuyId}
      />

      <CrudToolbar
        onCreate={() => {
          setDialogOpen(true);
          setCuyId(null);
        }}
        title="Sanidad"
      />
      <CrudTable columns={columns} data={dataUnicaPorCuy} />
      <ConfirmAlert
        open={deleteDialogOpen}
        title="Eliminar sanidad"
        message={`¿Deseas eliminar el registro de "${itemToDelete?.nombreMedicamento}"?`}
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
