"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CrudTable } from "@/components/shared/CrudTable";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Cuy } from "@/types/cuy";
import { Checkbox } from "@/components/ui/checkbox";
import { Ventas, VentasRequest } from "@/types/ventas";
import { getCuyAvailable } from "@/services/cuyService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAllVentas } from "@/services/ventaService";
interface VentaFormData {
  cantidad: number;
  total: number;
}

export default function FormVenta() {
  const [data, setData] = useState<Ventas[]>([]);
  const [cuyes, setCuyes] = useState<Cuy[]>([]);
  const [selectedCuyes, setSelectedCuyes] = useState<Cuy[]>([]);
  const [precioPorCuy, setPrecioPorCuy] = useState<string>("");
  const precio = parseFloat(precioPorCuy);
  const cantidad = selectedCuyes.length;
  const total = !isNaN(precio) ? precio * cantidad : 0;

  const {
    handleSubmit,
    // formState: { errors },
  } = useForm<VentaFormData>();

  const loadData = async () => {
    try {
      const res = await getCuyAvailable();
      setCuyes(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };

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

  const toggleCuySeleccion = (cuy: Cuy) => {
    setSelectedCuyes((prev) => {
      const exists = prev.some((item) => item.id === cuy.id);
      return exists
        ? prev.filter((item) => item.id !== cuy.id)
        : [...prev, cuy];
    });
  };

  const columsCuyes: ColumnDef<Cuy>[] = [
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
        const isSelected = selectedCuyes.some((cuy) => cuy.id === item.id);

        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleCuySeleccion(item)}
            />
          </div>
        );
      },
    },
  ];

  const columnsCuyesSelected: ColumnDef<Cuy>[] = [
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
        const [year, month, day] = fechaStr.split("-");
        return new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        ).toLocaleDateString();
      },
    },
  ];

  const onSubmit = () => {
    if (cantidad === 0 || isNaN(precio) || precio <= 0) {
      toast.error("Selecciona cuyes y asigna un precio válido.");
      return;
    }

    const venta: VentasRequest = {
      cantidad,
      total,
      cuyes: { id: selectedCuyes.map((cuy) => cuy.id) },
    };
    console.log(venta);
    toast.success("Venta registrada correctamente");
    setSelectedCuyes([]);
    setPrecioPorCuy("");
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 space-y-6"
        >
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Registrar Venta
            </h2>
            <p className="text-sm text-gray-500">
              Completa el precio por cuy y selecciona los cuyes disponibles.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-1 block">Cantidad</Label>
              <Input value={cantidad} disabled />
            </div>

            <div>
              <Label className="mb-1 block">Precio por cuy (S/)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={precioPorCuy}
                onChange={(e) => setPrecioPorCuy(e.target.value)}
                placeholder="Ej: 10.50"
              />
            </div>

            <div>
              <Label className="mb-1 block">Total (S/)</Label>
              <Input value={total.toFixed(2)} disabled />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={cantidad === 0 || +precioPorCuy <= 0}
              className="bg-primary cursor-pointer hover:bg-orange-400"
            >
              Registrar
            </Button>
          </div>
        </form>

        <div className="w-full lg:w-1/2 overflow-auto max-h-[400px] border border-gray-200 rounded">
          <h3 className="text-base font-semibold text-gray-700 px-4 pt-4">
            Cuyes seleccionados
          </h3>
          <div className="p-4">
            <CrudTable data={selectedCuyes} columns={columnsCuyesSelected} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6 overflow-auto max-h-[400px] border border-gray-200">
        <CrudTable data={cuyes} columns={columsCuyes} />
      </div>
    </>
  );
}
