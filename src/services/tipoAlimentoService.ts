import { apiFetch } from "@/lib/api";

const BASE = "/tipoalimento";

export const getAllTiposAlimentos = (): Promise<
  { id: number; nombre: string }[]
> => apiFetch(`${BASE}/find/all`);
