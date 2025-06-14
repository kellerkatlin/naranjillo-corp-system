import { apiFetch } from "@/lib/api";
import { CuyPadre } from "@/types/cuy";

const BASE = "/javacuy";

export const getCuyesPadres = (
  sexo: string,
  categoriaName: string
): Promise<CuyPadre[]> =>
  apiFetch(`${BASE}/cuyes/vivos/categoria/${categoriaName}/sexo/${sexo}`);

//localhost:8080/javacuy/cuyes/vivos/categoria/{categoria}/sexo/{sexo}
