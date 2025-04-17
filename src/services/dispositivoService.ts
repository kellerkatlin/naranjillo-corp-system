import { apiFetch } from "@/lib/api";
import { Dispositivo, DispositivoRequest } from "@/types/dispositivo";

const BASE = "/dispositivo";

export const getAllDispositivos = (): Promise<Dispositivo[]> =>
  apiFetch(`${BASE}/find/all`);

export const createDispositivo = (data: DispositivoRequest) =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
