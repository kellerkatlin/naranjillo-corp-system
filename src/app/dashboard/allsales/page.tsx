"use client";

// import { deleteAlimentacion } from "@/services/alimentacionService";
// import { Alimentacion } from "@/types/alimentacion";
import { ColumnDef } from "@tanstack/react-table";

import { useEffect, useState } from "react";
// import AlimentacionDialog from "@/components/AlimentacionDialog";
import { toast } from "sonner";
// import { CrudToolbar } from "@/components/shared/CrudToolbar";
import { CrudTable } from "@/components/shared/CrudTable";
// import ConfirmAlert from "@/components/shared/ComfirmAlert";
import { getAllVentas } from "@/services/ventaService";
import { VentasResponse } from "@/types/ventas";

export default function VentasAll() {
  const [data, setData] = useState<VentasResponse[]>([]);
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [itemToDelete, setItemToDelete] = useState<Alimentacion | null>(null);

  const loadData = async () => {
    try {
      const res = await getAllVentas();

      setData(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: ColumnDef<VentasResponse>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "cantidad", header: "Cantidad" },
    { accessorKey: "total", header: "Total" },
  ];

  // const handleDelete = async (id: number) => {
  //   try {
  //     await deleteAlimentacion(id);
  //     setData((prev) => prev.filter((item) => item.id !== id));
  //     toast.success("Eliminado");
  //   } catch {
  //     toast.error("Error al eliminar");
  //   }
  // };

  return (
    <div className="bg-gray-50 min-h-screen  p-10 gap-10">
      <CrudTable columns={columns} data={data} />
      {/* <ConfirmAlert
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
      /> */}
    </div>
  );
}
