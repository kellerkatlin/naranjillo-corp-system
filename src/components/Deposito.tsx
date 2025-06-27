import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import DialogMonitoreo from "./DialogMonitoreo";

interface DepositoProps {
  readonly porcentaje: number;
  readonly nombre: string;
}
export default function Deposito({ porcentaje, nombre }: DepositoProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card
        className="col-span-12 md:col-span-6 w-full cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <CardContent className="flex gap-2 w-full ">
          <div className="w-44 h-auto border-2 rounded-b-md border-black relative overflow-hidden">
            <div
              className="absolute bottom-0 left-0 w-full bg-[#29f151]"
              style={{ height: `${porcentaje}%` }}
            />

            <div className="absolute inset-0 flex items-end bottom-6 justify-center z-10 text-black font-bold">
              <span className="bg-blue-400 py-0.5 rounded-sm text-white px-3">
                {porcentaje} %
              </span>
            </div>
          </div>
          <div className="text-sm w-full">
            <span className="bg-blue-500 font-semibold text-white px-2 pb-0.5 rounded-xl">
              Deposito de Cuyiniza 1{" "}
            </span>
            <p className="font-semibold mt-1">Inicio: 26/06/2025</p>
            <p className="font-semibold">Fin: 30/06/2025</p>
            <div className="flex items-center  gap-3">
              <div className="flex-col flex w-full justify-center ">
                <span className="pl-5 font-semibold">Cántidad</span>
                <div className="flex flex-col items-start text-xs">
                  <p> Hace 1 día: 20%</p>
                  <p> Hace 2 día: 30%</p>
                  <p>Hace 3 día: 40%</p>
                </div>
              </div>
              <div className="flex w-full items-center justify-center">
                <span className="text-3xl text-blue-400 font-semibold">
                  {" "}
                  50%
                </span>
              </div>
            </div>
            {/* <p className=" text-sm font-semibold uppercase">{nombre}</p> */}
          </div>
        </CardContent>
      </Card>
      <DialogMonitoreo nombre={nombre} open={open} setOpen={setOpen} />
    </>
  );
}
