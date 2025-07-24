import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

interface CrudToolbarProps {
  readonly onCreate: () => void;
  readonly title?: string;
  readonly setSearch?: (search: string) => void;
  readonly search?: string;
  readonly onToggleJavaFilter?: () => void;
  readonly isFilteringSinJava?: boolean;
}

export function CrudToolbar({
  onCreate,
  title,
  setSearch,
  search,
  onToggleJavaFilter,
  isFilteringSinJava,
}: CrudToolbarProps) {
  const [inputValue, setInputValue] = useState(search ?? "");
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 p-2 w-full">
      <div className="flex flex-wrap gap-2 w-full">
        <input
          type="text"
          placeholder="Buscar..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm flex-grow min-w-[100px]"
        />

        <Button
          className="bg-white cursor-pointer hover:bg-gray-50 border"
          onClick={() => setSearch?.(inputValue)}
          disabled={!inputValue}
        >
          <Search className="w-4 h-4 text-black" />
        </Button>

        <Button
          className="bg-green-500 hover:bg-green-600 cursor-pointer whitespace-nowrap"
          onClick={onCreate}
        >
          Añadir {title ?? "Registro"}
          <Plus className="ml-1" />
        </Button>
        <Button
          className={`cursor-pointer whitespace-nowrap ${
            !isFilteringSinJava
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100 border text-blue-500"
          }`}
          onClick={() => onToggleJavaFilter?.()}
        >
          Mostrar todos
        </Button>

        {/* <Button
          className={`cursor-pointer whitespace-nowrap ${
            isFilteringSinJava
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100 border text-blue-500"
          }`}
          onClick={() => onToggleJavaFilter?.()}
        >
          Cuyes sin Java
        </Button> */}
      </div>
    </div>
  );
}
