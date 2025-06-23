import { apiFetch } from "@/lib/api";
import {
  AlimentacionRequest,
  AlimentacionResponse,
} from "@/types/alimentacion";

const BASE = "/alimentacion";

export const getAllAlimentaciones = (): Promise<AlimentacionResponse[]> =>
  apiFetch(`${BASE}/find/all`);

export const createAlimentacion = (
  data: AlimentacionRequest
): Promise<AlimentacionResponse> =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateAlimentacion = (
  id: number,
  data: AlimentacionRequest
): Promise<AlimentacionResponse> =>
  apiFetch(`${BASE}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteAlimentacion = (id: number): Promise<void> =>
  apiFetch(`${BASE}/delete/${id}`, {
    method: "DELETE",
  });
