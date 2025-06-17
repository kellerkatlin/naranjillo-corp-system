import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

interface CrudToolbarProps {
  readonly onCreate: () => void;
  readonly title?: string;
  readonly setSearch?: (search: string) => void;
  readonly search?: string;
  readonly onLoadWithoutJava?: () => void; // <-- nueva prop
}

export function CrudToolbar({
  onCreate,
  title,
  setSearch,
  search,
  onLoadWithoutJava,
}: CrudToolbarProps) {
  const [inputValue, setInputValue] = useState(search ?? "");
  return (
    <div className="flex items-center justify-between mb-4 p-2">
      <div className="flex items-center justify-between p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <Button
            className="bg-white cursor-pointer hover:bg-gray-50 border"
            onClick={() => setSearch?.(inputValue)}
            disabled={!inputValue}
          >
            <Search className="w-4 h-4 text-black" />
          </Button>

          <Button
            className="bg-green-500 hover:bg-green-600 cursor-pointer"
            onClick={onCreate}
          >
            Añadir {title ?? "Registro"}
            <Plus />
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
            onClick={onLoadWithoutJava}
          >
            Cuyes sin Java
          </Button>
        </div>
      </div>
    </div>
  );
}
