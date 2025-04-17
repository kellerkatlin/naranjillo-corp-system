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
