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
import { VentasRequest } from "@/types/ventas";
import { getCuyAvailable } from "@/services/cuyService";

interface VentaFormData {
  cantidad: number;
  total: number;
}

export default function FormVentas() {
  const [cuyes, setCuyes] = useState<Cuy[]>([]);
  const [selectedCuyes, setSelectedCuyes] = useState<Cuy[]>([]);
  const [precioPorCuy, setPrecioPorCuy] = useState<string>("");
  const precio = parseFloat(precioPorCuy);
  const cantidad = selectedCuyes.length;
  const total = !isNaN(precio) ? precio * cantidad : 0;

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<VentaFormData>();

  const loadData = async () => {
    try {
      const res = await getCuyAvailable();
      setCuyes(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      <div className="flex  gap-2  bg-gray-100 p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded shadow max-w-md w-full mx-auto"
        >
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Registrar Venta
          </h2>

          <div className="grid grid-cols-1 gap-4 mb-6">
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
              className="bg-primary hover:bg-orange-400"
            >
              Registrar
            </Button>
          </div>
        </form>
        <div className="flex flex-col">
          <CrudTable data={selectedCuyes} columns={columnsCuyesSelected} />
        </div>
      </div>
      <CrudTable data={cuyes} columns={columsCuyes} />
    </>
  );
}
