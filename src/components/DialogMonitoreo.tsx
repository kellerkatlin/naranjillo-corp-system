import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DialogMonitoreProps {
  readonly setOpen: (open: boolean) => void;
  readonly open: boolean;
  readonly nombre: string;
}

export default function DialogMonitoreo({
  nombre,
  open,
  setOpen,
}: DialogMonitoreProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
              {nombre}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Sección de inputs y botones */}
        <div className="grid grid-cols-3 gap-4 my-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Ingrese el Costo" disabled />
            <Button className="bg-green-500 hover:bg-green-600">
              Añadir (S/)
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Peso Inicial" disabled />
            <Button className="bg-green-500 hover:bg-green-600">
              Añadir (Kg)
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Peso Final" disabled />
            <Button className="bg-green-500 hover:bg-green-600">
              Añadir (Kg)
            </Button>
          </div>
        </div>

        {/* Tabla */}
        <table className="w-full border-t border-black text-sm mt-4">
          <thead>
            <tr className="text-left border-b border-black">
              <th className="py-2 px-2">Fecha Inicial</th>
              <th className="py-2 px-2">Fecha Fin</th>
              <th className="py-2 px-2">Humedad</th>
              <th className="py-2 px-2">Peso Inicial</th>
              <th className="py-2 px-2">Peso Final</th>
              <th className="py-2 px-2">Costo</th>
              <th className="py-2 px-2">Temperatura</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-2">Por default</td>
              <td className="py-2 px-2">Por defaulta</td>
              <td className="py-2 px-2">20%</td>
              <td className="py-2 px-2">20kg</td>
              <td className="py-2 px-2">15Kg</td>
              <td className="py-2 px-2">S/ 0.00</td>
              <td className="py-2 px-2">Por default</td>
            </tr>
          </tbody>
        </table>

        {/* Botones inferiores */}
        <div className="flex justify-end gap-4 mt-6">
          <Button className="bg-green-500 hover:bg-green-600">Empezar</Button>
          <Button className="bg-orange-400 hover:bg-orange-500">
            Finalizar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
