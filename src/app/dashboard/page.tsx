"use client";
import ResumenItem from "@/components/ResumeItem";
import { Calendar } from "@/components/ui/calendar";
import { getAllCuyes } from "@/services/cuyService";
import { Cuy } from "@/types/cuy";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [data, setData] = useState<Cuy[]>([]);

  const loadData = async () => {
    try {
      const res = await getAllCuyes();
      setData(res);
    } catch {
      toast.error("Error al cargar datos");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2 flex flex-col gap-4">
        <div className="flex gap-6">
          <div className="bg-white p-6 rounded shadow w-1/2">
            <h3 className="text-sm text-gray-500 font-semibold">
              TOTAL DE CUYES
            </h3>
            <p className="text-4xl font-bold">{data.length}</p>
            <span className="text-gray-500 text-sm">MARZO</span>
          </div>

          <div className="bg-white p-6 rounded shadow w-1/2">
            <h3 className="text-sm text-gray-500 font-semibold">
              PESO PROMEDIO
            </h3>
            <p className="text-4xl font-bold">2.8 KG</p>
            <span className="text-gray-500 text-sm">MARZO</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-md font-bold text-gray-600 mb-4">
            RESUMEN GENERAL
          </h3>
          <div className="space-y-3">
            <ResumenItem label="Cuyes machos" value={30} color="bg-green-500" />
            <ResumenItem
              label="Cuyes hembras"
              value={72}
              color="bg-green-600"
            />
            <ResumenItem
              label="Cuyes fallecidos"
              value={7}
              color="bg-pink-500"
            />
            <ResumenItem
              label="Cuyes en tratamiento"
              value={7}
              color="bg-pink-500"
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-1  col-span-2 bg-white p-6 rounded shadow">
        <h3 className="text-md font-bold text-gray-600 mb-2">CALENDARIO</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md "
        />
      </div>
    </div>
  );
}
