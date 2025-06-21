import React, { useMemo } from "react";
import { differenceInDays } from "date-fns";
import { Slider } from "./ui/slider";
import { SliderRange, SliderThumb, SliderTrack } from "@radix-ui/react-slider";

interface TimelineSliderProps {
  fechaInicio: Date;
  // duraciones (en días) de cada fase; ajústalas a tu necesidad
  phases?: { label: string; days: number }[];
}

export function TimeLine({
  fechaInicio,
  phases = [
    { label: "Cría", days: 30 },
    { label: "Engorde", days: 30 },
    { label: "Venta", days: 30 },
  ],
}: TimelineSliderProps) {
  // días que han pasado desde la fecha de inicio
  const hoy = new Date();
  const diasTranscurridos = differenceInDays(hoy, fechaInicio ?? hoy);

  // total de días de todas las fases
  const totalDias = useMemo(
    () => phases.reduce((sum, p) => sum + p.days, 0),
    [phases]
  );

  // valor “clamp” entre 0 y totalDias
  const valor = Math.min(Math.max(diasTranscurridos, 0), totalDias);

  return (
    <div className="w-full pr-5 ">
      {/* Slider “read-only” */}
      <Slider
        value={[valor]}
        max={totalDias}
        step={1}
        disabled
        className="w-full"
      >
        {/* Rail sin color de fondo */}
        <SliderTrack className="relative h-2 bg-gray-200/30 rounded-full">
          {/* Rango coloreado sólo hasta el thumb */}
          <SliderRange className="absolute h-full bg-green-500 rounded-full" />
        </SliderTrack>
        <SliderThumb className="block w-4 h-4 bg-white rounded-full ring-2 ring-green-500" />
      </Slider>

      {/* Etiquetas de fases */}
      <div className="flex justify-between text-xs mt-1">
        {phases.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>

      {/* Contador de días */}
      <div className="text-right text-[10px] text-gray-500 mt-1">
        {diasTranscurridos} / {totalDias} días
      </div>
    </div>
  );
}
