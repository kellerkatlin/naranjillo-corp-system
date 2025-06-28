import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCajita, updateCajita } from "@/services/cajitaService";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { CajitaResponse } from "@/types/cajita";
import { LecturaGeneralResponse } from "@/types/lectura";
import { useEffect } from "react";
interface DialogMonitoreProps {
  readonly setOpen: (open: boolean) => void;
  readonly open: boolean;
  readonly nombre: string;
  readonly numero: number;
  readonly cajitas: CajitaResponse[];
  readonly lecturaGeneral: LecturaGeneralResponse[];
}

const schema = z.object({
  pesoInicial: z.number().min(0, "Peso inicial requerido"),
  pesoFinal: z.number().min(0, "Peso final requerido"),
  costo: z.number().min(0, "Costo requerido"),
});

type FormValues = z.infer<typeof schema>;

export default function DialogMonitoreo({
  nombre,
  numero,
  cajitas,
  open,
  lecturaGeneral,
  setOpen,
}: DialogMonitoreProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      pesoInicial: 0,
      pesoFinal: 0,
      costo: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload = { ...data, numero };

    try {
      if (cajitas[0]) {
        const udpated = { ...data, numero };
        await updateCajita(cajitas[0].id, udpated);
        toast.success("Cajita actualizada correctamente");
      } else {
        // Si no existe -> crear
        await createCajita(payload);
        toast.success("Cajita creada correctamente");
      }
      reset();
      setOpen(false);
    } catch (err) {
      console.error("Error al guardar cajita:", err);
      toast.error("Ocurrió un error al guardar la cajita");
    }
  };
  useEffect(() => {
    if (cajitas[0]) {
      reset({
        pesoInicial: cajitas[0].pesoInicial ?? 0,
        pesoFinal: cajitas[0].pesoFinal ?? 0,
        costo: cajitas[0].costo ?? 0,
      });
    }
  }, [cajitas, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
              {nombre} (#{numero})
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Sección de inputs y botones */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {cajitas[0] && (
            <div className="grid grid-cols-3 gap-4 my-4">
              <div>
                <Label className="block mb-2">Costo (S/)</Label>
                <Input
                  type="number"
                  step="any"
                  {...register("costo", { valueAsNumber: true })}
                  placeholder="Ingrese el costo"
                />
                {errors.costo && (
                  <p className="text-red-500 text-sm">{errors.costo.message}</p>
                )}
              </div>
              <div>
                <Label className="block mb-2">Peso Inicial (Kg)</Label>
                <Input
                  type="number"
                  step="any"
                  {...register("pesoInicial", { valueAsNumber: true })}
                  placeholder="Peso Inicial"
                />
                {errors.pesoInicial && (
                  <p className="text-red-500 text-sm">
                    {errors.pesoInicial.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="block mb-2">Peso Final (Kg)</Label>
                <Input
                  type="number"
                  step="any"
                  disabled={!cajitas[0]}
                  {...register("pesoFinal", { valueAsNumber: true })}
                  placeholder="Peso Final"
                />
                {errors.pesoFinal && (
                  <p className="text-red-500 text-sm">
                    {errors.pesoFinal.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tabla */}
          <table className="w-full border-t border-black text-sm mt-6">
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
              {lecturaGeneral.length > 0 ? (
                lecturaGeneral.map((lectura, index) => {
                  const cajita = cajitas[0]; // usamos siempre la misma cajita del depósito

                  return (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="py-2 px-2">
                        {lectura.fechaHora ?? "N/A"}
                      </td>
                      <td className="py-2 px-2">
                        {lectura.fechaHora ?? "N/A"}
                      </td>
                      <td className="py-2 px-2">
                        {cajita?.lecturas?.slice(-5)[index]?.valor ?? "N/A"}%
                      </td>
                      <td className="py-2 px-2">
                        {cajita?.pesoInicial ?? "--"}kg
                      </td>
                      <td className="py-2 px-2">
                        {cajita?.pesoFinal ?? "--"}kg
                      </td>
                      <td className="py-2 px-2">S/ {cajita?.costo ?? "--"}</td>
                      <td className="py-2 px-2">
                        {lectura.temperatura ?? "N/A"}°C
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No hay lecturas disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Botones inferiores */}
          <div className="flex justify-end gap-4 mt-6">
            {cajitas[0] ? (
              <Button
                type="submit"
                onClick={() => setOpen(false)}
                className="bg-orange-400 hover:bg-orange-500"
              >
                Finalizar
              </Button>
            ) : (
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                Empezar
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
