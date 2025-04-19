"use client";

// import { CrudTable } from "@/components/shared/CrudTable";
import { getAllMonitoreo } from "@/services/monitoreoService";
import { Monitoreo } from "@/types/monitoreo";
// import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Deposito from "@/components/Deposito";
import { ThermometerIcon } from "lucide-react";

export default function MonitorDepositos() {
  const [monitoreo, setMonitoreo] = useState<Monitoreo | null>(null);

  const loadData = async (showToast = false) => {
    try {
      const res = await getAllMonitoreo();

      if (res && res.length > 0) {
        const ultimo = res[res.length - 1];
        setMonitoreo(ultimo);

        if (showToast) {
          toast.success("Datos cargados correctamente");
        }
      }
    } catch {
      if (showToast) {
        toast.error("Error al cargar datos");
      }
    }
  };

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => {
      loadData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // const columns: ColumnDef<Monitoreo>[] = [
  //   { accessorKey: "id", header: "ID" },
  //   { accessorKey: "hum1", header: "Humedad 1" },
  //   { accessorKey: "hum2", header: "Humedad 2" },
  //   { accessorKey: "hum3", header: "Humedad 3" },
  //   { accessorKey: "hum4", header: "Humedad 4" },
  //   { accessorKey: "temp5", header: "Temperatura" },
  //   { accessorKey: "nombre_dispositivo", header: "Nombre Dispositivo" },
  // ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-start p-10 gap-10">
      {/* <CrudTable data={data} columns={columns} /> */}
      <h2 className="text-gray-600 text-sm">
        Sistema de monitoreo de los depositos de desecho de cuy
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {monitoreo && (
          <>
            <Deposito porcentaje={monitoreo.hum1} nombre="Humedad 1" />
            <Deposito porcentaje={monitoreo.hum2} nombre="Humedad 2" />
            <Deposito porcentaje={monitoreo.hum3} nombre="Humedad 3" />
            <Deposito porcentaje={monitoreo.hum4} nombre="Humedad 4" />
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <ThermometerIcon
            size={64}
            strokeWidth={2.5}
            className="text-blue-500"
          />
          <span className="text-4xl font-semibold">
            {" "}
            {monitoreo ? monitoreo.temp5 : "--"}°
          </span>
        </div>
        <span className="uppercase text-sm text-gray-600 font-medium">
          Temperatura °C
        </span>
      </div>
    </div>
  );
}
