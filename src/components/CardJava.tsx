import React from "react";
import { Card, CardContent } from "./ui/card";
import { JavaRespose } from "@/types/java";
import Image from "next/image";
import { Badge } from "./ui/badge";

interface CardJavaProps {
  readonly java?: JavaRespose;
  readonly onClickEdit?: () => void; // <-- agregamos el callback opcional
  readonly imagen?: boolean;
}

export default function CardJava({ java, onClickEdit, imagen }: CardJavaProps) {
  const DIA_MS = 24 * 60 * 60 * 1000;

  function normalizar(fecha: Date) {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  }

  const diasReproduccion = java?.fechaReproduccion
    ? (() => {
        const inicio = normalizar(new Date(java.fechaReproduccion));
        const hoy = normalizar(new Date());

        const diffDias = Math.floor(
          (hoy.getTime() - inicio.getTime()) / DIA_MS
        );

        return diffDias;
      })()
    : undefined;

  return (
    <Card
      onClick={onClickEdit}
      className="w-36 h-36 border-black bg-red-50 border-none items-center justify-center relative cursor-pointer hover:scale-105"
    >
      <CardContent className="p-2  flex flex-col justify-center items-center text-center">
        <div className="font-semibold pt-3 text-gray-800 text-sm">
          {java?.nombre}
        </div>
        <Image
          src={imagen ? "/reproduccion.png" : "/machos.png"}
          alt={imagen ? "Reproducción" : "Machos"}
          className="size-20  object-contain "
          width={64}
          height={64}
        />

        {java?.categoria && (
          <div className="flex w-full pb-4 justify-between gap-3">
            <Badge variant="secondary" className="bg-blue-500 text-white">
              {diasReproduccion !== undefined
                ? `Días: ${diasReproduccion}`
                : "-"}
            </Badge>
            <div>cant. {java.cuyes.length}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
