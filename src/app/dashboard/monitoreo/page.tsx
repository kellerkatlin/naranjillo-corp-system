"use client";

import { getAllMonitoreo } from "@/services/monitoreoService";
import { Monitoreo } from "@/types/monitoreo";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import Deposito from "@/components/Deposito";
import { Sun, ThermometerIcon } from "lucide-react";
import { getAllCuyes } from "@/services/cuyService";
import { Cuy } from "@/types/cuy";
import { Card, CardContent } from "@/components/ui/card";

export default function MonitorDepositos() {
  const [monitoreo, setMonitoreo] = useState<Monitoreo>({
    id: 0,
    hum1: 0,
    hum2: 0,
    hum3: 0,
    ph: 0,
    hum4: 0,
    temp5: 0,
    nombre_dispositivo: "Sin datos",
  });

  const [cuyes, setCuyes] = useState<Cuy[]>([]);

  const loadData = async (showToast = false) => {
    try {
      const res = await getAllMonitoreo();
      if (res && res.length > 0) {
        const ultimo = res[res.length - 1];
        setMonitoreo(ultimo);
        if (showToast) toast.success("Datos cargados correctamente");
      }
    } catch {
      if (showToast) toast.error("Error al cargar datos");
    }
  };

  const loadCuyes = async () => {
    try {
      const data = await getAllCuyes();
      setCuyes(data);
    } catch (error) {
      console.error("Error al cargar cuyes", error);
    }
  };

  const exportToExcel = () => {
    if (!cuyes || cuyes.length === 0) {
      toast.error("No hay datos de cuyes para exportar");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(cuyes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cuyes");

    XLSX.writeFile(workbook, "cuyes.xlsx");
    toast.success("Cuyes exportados a Excel");
  };

  useEffect(() => {
    loadCuyes();
  }, []);

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => {
      loadData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-start p-10 gap-10">
      {/* <CrudTable data={data} columns={columns} /> */}
      <h2 className="text-gray-600 text-sm">
        Sistema de monitoreo de los depositos de desecho de cuy
      </h2>

      <div className="w-full flex justify-start items-center">
        <button
          onClick={exportToExcel}
          className="bg-blue-500 hover:bg-blue-600  text-white text-sm px-2 py-0.5 rounded"
        >
          Exportar a Excel
        </button>
      </div>

      <div className="md:flex justify-between w-full gap-3 ">
        <div className="grid grid-cols-12  gap-5 w-9/12">
          {monitoreo && (
            <>
              <Deposito porcentaje={monitoreo.hum1} nombre="Humedad 1" />
              <Deposito porcentaje={monitoreo.hum2} nombre="Humedad 2" />
              <Deposito porcentaje={monitoreo.hum3} nombre="Humedad 3" />
              <Deposito porcentaje={monitoreo.hum4} nombre="Humedad 4" />
            </>
          )}
        </div>
        <Card className="w-3/12 mt-3 md:mt-0">
          <CardContent className="h-full">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between">
                <div className="text-lg">
                  <p>Jueves</p>
                  <p>26 de Junio</p>
                </div>
                <Sun className="size-14" />
              </div>

              <div className="flex justify-center ">
                <div className="flex flex-col items-start">
                  <p className="text-start text-blue-400">Temp °C</p>
                  <span className="text-start text-5xl text-blue-500 font-semibold">
                    24°c
                  </span>
                </div>
              </div>

              <p className="text-end">Bajo Naranjillo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex w-full flex-col items-center gap-2">
        <CardContent>
          {/* <div className="flex items-center gap-2">
            <ThermometerIcon
              size={64}
              strokeWidth={2.5}
              className="text-blue-500"
            />
            <span className="text-4xl font-semibold">
              {monitoreo ? monitoreo.temp5 : "--"}°
            </span>
          </div>
          <span className="uppercase text-sm text-gray-600 font-medium">
            Temperatura °C
          </span> */}
          <div className="flex items-center justify-center ">
            <span className="text-4xl py-6 text-blue-400 font-semibold">
              {" "}
              pH 4.5
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
