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
  const diasReproduccion = java?.fechaReproduccion
    ? Math.max(
        0,
        Math.ceil(
          (new Date(new Date(java.fechaReproduccion).toDateString()).getTime() -
            new Date(new Date().toDateString()).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : undefined;

  console.log("diasReproduccion:", diasReproduccion);

  return (
    <Card
      onClick={onClickEdit}
      className="w-36 h-36 border-black bg-green-300 border-none items-center justify-center relative cursor-pointer hover:scale-105"
    >
      <CardContent className="p-2 flex flex-col justify-center items-center text-center">
        <div className="font-semibold text-gray-800 text-sm">
          {java?.nombre}
        </div>
        <Image
          src={imagen ? "/reproduccion.png" : "/machos.png"}
          alt={imagen ? "Reproducción" : "Machos"}
          className="size-20  object-contain "
          width={64}
          height={64}
        />
        <div className=" text-gray-800">
          {java?.sexo !== "NA" && java?.sexo}
        </div>
        {java?.categoria === "REPRODUCCION" && (
          <Badge variant="secondary" className="bg-blue-500 text-white">
            {diasReproduccion !== undefined ? `Días: ${diasReproduccion}` : "-"}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
