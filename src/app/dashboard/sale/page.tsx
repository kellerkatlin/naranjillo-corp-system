"use client";

import { Button } from "@/components/ui/button";
import { CrudTable } from "@/components/shared/CrudTable";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CuyPadre } from "@/types/cuy";
import { VentasRequest, VentasResponse } from "@/types/ventas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  createVenta,
  getAllVentas,
  listarCuyesDisponibles,
} from "@/services/ventaService";
import CuyesTable from "@/components/CuyesTable";
import DialogVenta from "@/components/DialogVenta";
import DialogFinalizarVenta from "@/components/DialogFinalizarVenta";
import { Card, CardContent } from "@/components/ui/card";
import DialogDetalleVenta from "@/components/DialogDetalleVenta";

type CarritoItem = {
  cuy: CuyPadre;
  precioVenta: number;
};

export default function FormVenta() {
  const [data, setData] = useState<VentasResponse[]>([]);
  const [cuyes, setCuyes] = useState<CuyPadre[]>([]);
  const [selectedCuy, setSelectedCuy] = useState<CuyPadre | null>(null);
  const [openFinalDialog, setOpenFinalDialog] = useState(false);
  const [ventaDetalle, setVentaDetalle] = useState<VentasResponse | null>(null);

  const [, setSelectedCuyes] = useState<CuyPadre[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  const loadData = async () => {
    try {
      const res = await listarCuyesDisponibles();
      setCuyes(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };

  const handleOpenModal = (cuy: CuyPadre) => {
    setSelectedCuy(cuy);
    setOpenDialog(true);
  };

  const handleCloseModal = () => {
    setOpenDialog(false);
    setSelectedCuy(null);
  };

  const handleAddToCart = (item: { cuy: CuyPadre; precioVenta: number }) => {
    setCarrito((prev) => [...prev, item]);
    console.log(carrito);
    // Elimina el cuy agregado de la lista principal
    setCuyes((prev) => prev.filter((c) => c.id !== item.cuy.id));
  };

  const handleRemoveItem = (index: number) => {
    // 1. Recuperar el cuy que se está quitando del carrito
    const itemQuitado = carrito[index];

    // 2. Eliminarlo del carrito
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);

    // 3. Restaurarlo a la lista de cuyes disponibles
    setCuyes((prev) => [...prev, itemQuitado.cuy]);

    // 4. Quitarlo también de los seleccionados, si aplica
    setSelectedCuyes((prev) =>
      prev.filter((cuy) => cuy.id !== itemQuitado.cuy.id)
    );
  };

  const total = carrito.reduce((sum, item) => sum + item.precioVenta, 0);

  const loadAllSales = async () => {
    try {
      const res = await getAllVentas();
      setData(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };
  useEffect(() => {
    loadAllSales();
    loadData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "ventas.xlsx");
  };

  const columsCuyes: ColumnDef<VentasResponse>[] = [
    { accessorKey: "id", header: "N° de comprobante " },

    { accessorKey: "cantidad", header: "Cántidad" },
    { accessorKey: "total", header: "P. Venta " },
    { accessorKey: "documento", header: "Dni/Ruc" },
    { accessorKey: "nombreRazonSocial", header: "Nombre/R. Social" },
    {
      id: "detalleVentas",
      header: "",
      cell: ({ row }) => (
        <Button
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setVentaDetalle(row.original)}
        >
          Detalle
        </Button>
      ),
    },
  ];

  const handleFinalizarVenta = async (venta: VentasRequest) => {
    try {
      await createVenta(venta);
      console.log("VENTA A ENVIAR:", venta);

      // Aquí deberías llamar a tu servicio de backend, por ejemplo:
      // await createVenta(venta);

      toast.success("Venta registrada correctamente");

      // Limpiar carrito y otros datos
      setCarrito([]);

      setOpenFinalDialog(false);

      // Puedes volver a cargar datos si lo necesitas
      // await loadData();
      // await loadAllSales();
    } catch (error) {
      toast.error("Error al registrar la venta");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-end items-center py-2 ">
        <button
          onClick={exportToExcel}
          className="bg-primary cursor-pointer text-white shadow px-4 py-2 rounded"
        >
          Ver todas las ventas
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col lg:flex-row gap-6 mx-auto max-w-7xl">
        <CuyesTable data={cuyes} onAdd={handleOpenModal} />

        <Card className="w-full lg:w-1/2 p-2 overflow-x-auto">
          <h3 className="text-base font-semibold text-gray-700 px-4 pt-4">
            Cuyes seleccionados
          </h3>

          {carrito.length > 0 && (
            <CardContent className="p-0 mt-2">
              <div className="flex justify-between mb-2 px-4">
                <h3 className="font-bold">CARRITO DE CUYES</h3>
                <span className="text-sm text-muted-foreground">
                  N° de comprobante 0001
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Id</th>
                      <th className="px-4 py-2">Edad (DÍAS)</th>
                      <th className="px-4 py-2">Sexo</th>
                      <th className="px-4 py-2">Cantidad</th>
                      <th className="px-4 py-2">P. Venta</th>
                      <th className="px-4 py-2 text-center">Quitar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-2">{item.cuy.id}</td>
                        <td className="px-4 py-2">{item.cuy.edad}</td>
                        <td className="px-4 py-2">{item.cuy.sexo}</td>
                        <td className="px-4 py-2">1</td>
                        <td className="px-4 py-2">
                          S/ {item.precioVenta.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveItem(i)}
                          >
                            -
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold">
                      <td colSpan={3}></td>
                      <td className="px-4 py-2">{carrito.length}</td>
                      <td className="px-4 py-2">S/ {total.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex justify-end mt-4 px-4">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setOpenFinalDialog(true)}
                >
                  Realizar venta
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6 overflow-auto max-h-[400px] border border-gray-200">
        <CrudTable data={data} columns={columsCuyes} />
      </div>

      <DialogVenta
        open={openDialog}
        onClose={handleCloseModal}
        cuy={selectedCuy}
        onSubmit={handleAddToCart}
      />
      <DialogFinalizarVenta
        open={openFinalDialog}
        onClose={() => setOpenFinalDialog(false)}
        carrito={carrito}
        onSubmit={handleFinalizarVenta}
      />
      <DialogDetalleVenta
        open={!!ventaDetalle}
        onClose={() => setVentaDetalle(null)}
        venta={ventaDetalle}
      />
    </>
  );
}
