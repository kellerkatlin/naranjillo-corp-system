interface DepositoProps {
  readonly porcentaje: number;
  readonly nombre: string;
}
export default function Deposito({ porcentaje, nombre }: DepositoProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-24 border-2 rounded-b-md border-black relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 w-full bg-[#29f151]"
          style={{ height: `${porcentaje}%` }}
        />

        <div className="absolute inset-0 flex items-center justify-center z-10 text-black font-bold">
          {porcentaje} %
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold uppercase">{nombre}</span>
    </div>
  );
}
