"use client";

import { Button } from "@/components/ui/button";
import {
  createAlimentacion,
  deleteAlimentacion,
  getAllAlimentaciones,
  updateAlimentacion,
} from "@/services/alimentacionService";
import {
  AlimentacionRequest,
  AlimentacionResponse,
} from "@/types/alimentacion";
import { ColumnDef } from "@tanstack/react-table";

import { useEffect, useMemo, useState } from "react";
import AlimentacionDialog from "@/components/AlimentacionDialog";
import { toast } from "sonner";
import { CrudTable } from "@/components/shared/CrudTable";
import ConfirmAlert from "@/components/shared/ComfirmAlert";
import DetalleAlimentacionDialog from "@/components/DetalleAlimentacionDialog";

/**
 * Componente para gestionar la alimentación.
 * Permite registrar, editar, eliminar y visualizar registros de alimentación.
 */
export default function FormAlimentacion() {
  /** Estado para almacenar la lista de alimentaciones. */
  const [data, setData] = useState<AlimentacionResponse[]>([]);
  /** Estado para controlar la visibilidad del diálogo de registro/edición. */
  const [dialogOpen, setDialogOpen] = useState(false);
  /** Estado para almacenar el ítem de alimentación que se está editando. */
  const [editItem, setEditItem] = useState<AlimentacionResponse | null>(null);
  /** Estado para controlar la visibilidad del diálogo de confirmación de eliminación. */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  /** Estado para almacenar el ítem de alimentación que se va a eliminar. */
  const [itemToDelete, setItemToDelete] = useState<AlimentacionResponse | null>(
    null
  );
  /** Estado para almacenar la lista de reproducciones disponibles. */

  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleData, setDetalleData] = useState<AlimentacionResponse[]>([]);
  const [detalleJavaNombre, setDetalleJavaNombre] = useState("");

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

  const agrupados = useMemo(() => {
    const map = new Map<
      string,
      AlimentacionResponse & { totalCantidad: number; totalCosto: number }
    >();

    data.forEach((item) => {
      const key = item.java.nombre;

      if (!map.has(key)) {
        map.set(key, {
          ...item,
          totalCantidad: item.cantidad,
          totalCosto: item.costo,
        });
      } else {
        const actual = map.get(key)!;
        map.set(key, {
          ...actual,
          totalCantidad: actual.totalCantidad + item.cantidad,
          totalCosto: actual.totalCosto + item.costo,
        });
      }
    });

    return Array.from(map.values());
  }, [data]);

  /** Definición de las columnas para la tabla de alimentaciones. */
  const columns: ColumnDef<
    AlimentacionResponse & { totalCantidad: number; totalCosto: number }
  >[] = [
    { accessorKey: "java.nombre", header: "Java" },

    {
      accessorKey: "totalCantidad",
      header: "Cantidad",
      cell: ({ row }) => row.original.totalCantidad,
    },

    {
      accessorKey: "totalCosto",
      header: "Costo",
      cell: ({ row }) => `S/ ${row.original.totalCosto.toFixed(2)}`,
    },

    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-center items-center gap-2">
            <Button
              className="cursor-pointer"
              size="sm"
              onClick={() => {
                const javaNombre = item.java.nombre;
                const filtrados = data.filter(
                  (al) => al.java.nombre === javaNombre
                );
                setDetalleJavaNombre(javaNombre);
                setDetalleData(filtrados);
                setDetalleOpen(true);
              }}
            >
              Detalle
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
      <CrudTable columns={columns} data={agrupados} />
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
      <DetalleAlimentacionDialog
        open={detalleOpen}
        onOpenChange={setDetalleOpen}
        alimentaciones={detalleData}
        javaNombre={detalleJavaNombre}
      />
    </>
  );
}
