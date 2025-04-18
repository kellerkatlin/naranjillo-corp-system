import { apiFetch } from "@/lib/api";
import { Alimentacion, AlimentacionRequest } from "@/types/alimentacion";

const BASE = "/alimentacion";

export const getAllAlimentaciones = (): Promise<Alimentacion[]> =>
  apiFetch(`${BASE}/find/all`);

export const createAlimentacion = (
  data: AlimentacionRequest
): Promise<Alimentacion> =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateAlimentacion = (
  id: number,
  data: AlimentacionRequest
): Promise<Alimentacion> =>
  apiFetch(`${BASE}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteAlimentacion = (id: number): Promise<void> =>
  apiFetch(`${BASE}/delete/${id}`, {
    method: "DELETE",
  });
