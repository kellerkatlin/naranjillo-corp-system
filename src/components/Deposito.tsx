interface DepositoProps {
  readonly porcentaje: number;
  readonly nombre: string;
}
export default function Deposito({ porcentaje, nombre }: DepositoProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-24 border-2 rounded-b-md border-black relative">
        <div
          className="absolute bottom-0 left-0 w-full bg-[#29f151] text-black text-center font-bold"
          style={{ height: `${porcentaje}%` }}
        >
          {porcentaje} %
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold uppercase">{nombre}</span>
    </div>
  );
}
