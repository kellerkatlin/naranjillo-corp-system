import React from "react";
import { Card, CardContent } from "./ui/card";
import { JavaRespose } from "@/types/java";

interface CardJavaProps {
  readonly java?: JavaRespose;
  readonly onClickEdit?: () => void; // <-- agregamos el callback opcional
}

export default function CardJava({ java, onClickEdit }: CardJavaProps) {
  return (
    <Card
      onClick={onClickEdit}
      className="w-36 h-36 border-black bg-green-400 items-center justify-center relative cursor-pointer hover:scale-105"
    >
      <CardContent className="p-2 flex flex-col justify-center items-center text-center">
        <div className="font-semibold text-white text-lg">{java?.nombre}</div>
        <div className="mt-2 text-white">{java?.sexo}</div>
      </CardContent>
    </Card>
  );
}
