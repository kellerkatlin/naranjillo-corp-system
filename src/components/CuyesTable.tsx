import { CuyPadre } from "@/types/cuy";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

type Props = {
  readonly data: CuyPadre[];
  readonly onAdd: (cuy: CuyPadre) => void;
};

export default function CuyesTable({ data, onAdd }: Props) {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const paginatedData = data?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Card className="w-full lg:w-1/2 p-2 overflow-x-auto">
      <h2 className="text-lg font-bold mb-1">TODOS LOS CUYES</h2>
      <CardContent className="p-0">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Java</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((cuy) => (
              <tr key={cuy.id} className="border-b">
                <td className="px-4 py-2">{cuy.id}</td>
                <td className="px-4 py-2">{cuy.categoria}</td>
                <td className="px-4 py-2">{cuy.nombreJavaOrigen ?? "-"}</td>
                <td className="px-4 py-2">Sin precio</td>
                <td className="px-4 py-2 text-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => onAdd(cuy)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 px-2">
          <span className="text-sm text-muted-foreground">
            {`${(page - 1) * itemsPerPage + 1} de ${data?.length}`}
          </span>

          <div className="space-x-2">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="secondary"
              disabled={page * itemsPerPage >= data?.length}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
