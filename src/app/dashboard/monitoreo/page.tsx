"use client";

import { CrudTable } from "@/components/shared/CrudTable";
import { getAllMonitoreo } from "@/services/monitoreoService";
import { Monitoreo } from "@/types/monitoreo";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// import Deposito from "@/components/Deposito";
// import { ThermometerIcon } from "lucide-react";

export default function MonitorDepositos() {
  const [data, setData] = useState<Monitoreo[]>([]);

  const loadData = async () => {
    try {
      const res = await getAllMonitoreo();

      setData(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const columns: ColumnDef<Monitoreo>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "hum1", header: "Humedad 1" },
    { accessorKey: "hum2", header: "Humedad 2" },
    { accessorKey: "hum3", header: "Humedad 3" },
    { accessorKey: "hum4", header: "Humedad 4" },
    { accessorKey: "temp5", header: "Temperatura" },
    { accessorKey: "nombre_dispositivo", header: "Nombre Dispositivo" },
  ];
  // const datos = [
  //   { porcentaje: 90, nombre: "Deposito 1" },
  //   { porcentaje: 60, nombre: "Deposito 2" },
  //   { porcentaje: 50, nombre: "Deposito 3" },
  //   { porcentaje: 30, nombre: "Deposito 4" },
  // ];

  // const temperatura = 30;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-start p-10 gap-10">
      <CrudTable data={data} columns={columns} />
      {/* <h2 className="text-gray-600 text-sm">
        Sistema de monitoreo de los depositos de desecho de cuy
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {datos.map((dep, i) => (
          <Deposito key={i} porcentaje={dep.porcentaje} nombre={dep.nombre} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <ThermometerIcon
            size={64}
            strokeWidth={2.5}
            className="text-blue-500"
          />
          <span className="text-4xl font-semibold">{temperatura}°</span>
        </div>
        <span className="uppercase text-sm text-gray-600 font-medium">
          Temperatura °C
        </span>
      </div> */}
    </div>
  );
}
