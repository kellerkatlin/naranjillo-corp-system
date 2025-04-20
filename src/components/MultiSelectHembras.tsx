import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Cuy } from "@/types/cuy";

interface MultiSelectProps {
  options: Cuy[];
  selected: { id: number }[];
  onChange: (selected: { id: number }[]) => void;
  disabled?: boolean;
}

export function MultiSelectHembras({
  options,
  selected,
  onChange,
  disabled,
}: MultiSelectProps) {
  const isSelected = (id: number) => selected.some((item) => item.id === id);

  const toggle = (id: number) => {
    if (disabled) return;

    if (isSelected(id)) {
      onChange(selected.filter((item) => item.id !== id));
    } else {
      if (selected.length >= 9) {
        toast.error(
          "Solo puedes seleccionar hasta 9 hembras. Desmarca una para seleccionar otra."
        );
        return;
      }
      onChange([...selected, { id }]);
    }
  };
  const selectedOptions = options.filter((hembra) =>
    selected.some((s) => s.id === hembra.id)
  );
  if (disabled) {
    return (
      <div className="border rounded-md px-4 py-2 bg-muted text-muted-foreground">
        {selectedOptions.length > 0 ? (
          <ul className="list-disc ml-4">
            {selectedOptions.map((hembra) => (
              <li key={hembra.id}>
                ID: {hembra.id} - {hembra.categoria}
              </li>
            ))}
          </ul>
        ) : (
          <span>No hay madres seleccionadas</span>
        )}
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selected.length > 0
            ? `${selected.length} seleccionadas`
            : "Selecciona madres"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 overflow-auto">
        <ScrollArea className="max-h-52">
          <div className="space-y-1">
            {options.map((hembra) => (
              <div
                key={hembra.id}
                onClick={() => toggle(hembra.id)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-md cursor-pointer"
              >
                <Checkbox checked={isSelected(hembra.id)} />
                <span>
                  ID: {hembra.id} - {hembra.categoria}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
