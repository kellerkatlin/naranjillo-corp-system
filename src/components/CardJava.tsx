import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

interface CardJavaProps {
  readonly java?: any;
}

export default function CardJava({ java }: CardJavaProps) {
  return (
    <Card className="w-36 h-36 border-black bg-green-400 items-center justify-center">
      <CardContent className="p-2 ">
        <div>{java?.nombre}</div>
        <Image src={java?.imagen} alt={java?.nombre} width={100} height={100} />
        <div>{java?.dias}</div>
      </CardContent>
    </Card>
  );
}
