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

import { useEffect, useState } from "react";
import AlimentacionDialog from "@/components/AlimentacionDialog";
import { toast } from "sonner";
import { CrudTable } from "@/components/shared/CrudTable";
import ConfirmAlert from "@/components/shared/ComfirmAlert";

/**
 * Componente para gestionar la alimentación.
 * Permite registrar, editar, eliminar y visualizar registros de alimentación.
 */
export default function FormAlimentacion() {
  /** Estado para almacenar la lista de alimentaciones. */
  const [data, setData] = useState<Alimentacion[]>([]);
  /** Estado para controlar la visibilidad del diálogo de registro/edición. */
  const [dialogOpen, setDialogOpen] = useState(false);
  /** Estado para almacenar el ítem de alimentación que se está editando. */
  const [editItem, setEditItem] = useState<Alimentacion | null>(null);
  /** Estado para controlar la visibilidad del diálogo de confirmación de eliminación. */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  /** Estado para almacenar el ítem de alimentación que se va a eliminar. */
  const [itemToDelete, setItemToDelete] = useState<Alimentacion | null>(null);
  /** Estado para almacenar la lista de reproducciones disponibles. */

  /**
   * Efecto para cargar los datos iniciales de alimentaciones y reproducciones
   * cuando el componente se monta.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllAlimentaciones();
        setData(res);
      } catch {
        toast.error("Error al cargar datos");
      }
    };

    fetchData();
  }, []);

  /** Definición de las columnas para la tabla de alimentaciones. */
  const columns: ColumnDef<Alimentacion>[] = [
    {
      accessorKey: "fechaAlimentacion",
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
    { accessorKey: "java.nombre", header: "Java" },
    { accessorKey: "tipoAlimento.nombre", header: "Tipo de Alimento" },

    {
      accessorKey: "cantidad",
      header: "Cantidad",
    },
    {
      accessorKey: "unidadMedida.nombre",
      header: "U.Medida",
    },
    {
      accessorKey: "costo",
      header: "Costo",
    },
    {
      id: "acciones",
      header: "Acciones",
      /**
       * Renderiza los botones de acciones (editar, eliminar) para cada fila.
       * @param {object} props - Propiedades de la celda.
       * @param {object} props.row - Fila actual de la tabla.
       * @returns {JSX.Element} Botones de acciones.
       */
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
              Detalle
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
              Agregar Alimento
            </Button>
          </div>
        );
      },
    },
  ];

  /**
   * Maneja el envío del formulario de registro o edición de alimentación.
   * @param {AlimentacionRequest} form - Datos del formulario.
   */

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

  /**
   * Maneja la eliminación de un registro de alimentación.
   * @param {number} id - ID del registro de alimentación a eliminar.
   */
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
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditItem(null);
        }}
        onSubmit={onSubmit}
        alimentacion={editItem}
      />
      <div className="flex items-center justify-between mb-4 p-2 ">
        <Button
          className="bg-primary  hover:bg-orange-400 cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          Registrar Alimentación
        </Button>
      </div>
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
