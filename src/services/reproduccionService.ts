import { apiFetch } from "@/lib/api";
import { Reproduccion, ReproduccionRequest } from "@/types/reproduccion";

const BASE = "/reproduccion";

export const getAllReproducciones = (): Promise<Reproduccion[]> =>
  apiFetch(`${BASE}/find/all`);

export const createReproduccion = (data: ReproduccionRequest) =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
