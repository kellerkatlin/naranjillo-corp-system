import { Card, CardContent } from "./ui/card";

interface DepositoProps {
  readonly porcentaje: number;
  readonly numero: number;
  readonly onClick: (selectedDeposito: number) => void;
}
export default function Deposito({
  porcentaje,
  numero,
  onClick,
}: DepositoProps) {
  return (
    <Card
      className="col-span-12 md:col-span-6 w-full cursor-pointer"
      onClick={() => onClick(numero)}
    >
      <CardContent className="flex md:flex-row flex-col  gap-2 w-full ">
        <div className="w-44 h-36 border-2 rounded-b-md border-black relative overflow-hidden">
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
          <span className="bg-blue-500 font-semibold text-sm text-white px-2 pb-0.5 rounded-xl">
            Deposito de Cuyinaza {numero}{" "}
          </span>
          <p className="font-semibold mt-1">Inicio: 26/06/2025</p>
          <p className="font-semibold">Fin: 30/06/2025</p>
          <div className="flex items-center  gap-3">
            <div className="flex-col flex w-full justify-center "></div>
            <div className="flex w-full items-center justify-center">
              <span className="text-3xl text-blue-400 font-semibold">
                {porcentaje}%
              </span>
            </div>
          </div>
          {/* <p className=" text-sm font-semibold uppercase">{nombre}</p> */}
        </div>
      </CardContent>
    </Card>
  );
}
