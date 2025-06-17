import { apiFetch } from "@/lib/api";

const BASE = "/tipoalimento";

export const getAllTiposAlimentos = (): Promise<
  { id: number; nombre: string }[]
> => apiFetch(`${BASE}/find/all`);

export const createTipoAlimento = (
  nombre: string
): Promise<{ id: number; nombre: string }> =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify({ nombre }),
  });
