import { apiFetch } from "@/lib/api";
import { Sanidad, SanidadRequest } from "@/types/sanidad";

const BASE = "/sanidad";

export const getAllSanidades = (): Promise<Sanidad[]> =>
  apiFetch(`${BASE}/find/all`);

export const createSanidad = (data: SanidadRequest): Promise<Sanidad> =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateSanidad = (
  id: number,
  data: SanidadRequest
): Promise<Sanidad> =>
  apiFetch(`${BASE}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteSanidad = (id: number) =>
  apiFetch(`${BASE}/delete/${id}`, {
    method: "DELETE",
  });
