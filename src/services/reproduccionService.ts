import { apiFetch } from "@/lib/api";
import { Reproduccion, ReproduccionRequest } from "@/types/reproduccion";

const BASE = "/reproduccion";

export const getAllReproducciones = (): Promise<Reproduccion[]> =>
  apiFetch(`${BASE}/find/all`);

export const createReproduccion = (
  data: ReproduccionRequest
): Promise<Reproduccion> =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateReproduccion = (
  id: number,
  data: ReproduccionRequest
): Promise<Reproduccion> =>
  apiFetch(`${BASE}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteReproduccion = (id: number) =>
  apiFetch(`${BASE}/delete/${id}`, {
    method: "DELETE",
  });
