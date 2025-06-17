import { apiFetch } from "@/lib/api";

const BASE = "/unidadmedida";

export const getAllUnidades = (): Promise<
  { id: number; nombre: string; simbolo: string }[]
> => apiFetch(`${BASE}/find/all`);

export const createUnidad = (data: { nombre: string; simbolo: string }) =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
