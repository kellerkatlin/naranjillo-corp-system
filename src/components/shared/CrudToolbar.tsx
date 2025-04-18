// components/shared/CrudToolbar.tsx
import { Button } from "@/components/ui/button";

interface CrudToolbarProps {
  onCreate: () => void;
  title?: string;
}

export function CrudToolbar({ onCreate, title }: CrudToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button className="bg-primary hover:bg-orange-400" onClick={onCreate}>
        Crear nuevo {title ? title : "Registro"}
      </Button>
    </div>
  );
}
