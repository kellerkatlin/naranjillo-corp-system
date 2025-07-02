import { apiFetch } from "@/lib/api";

import { CajitaRequest, CajitaResponse } from "@/types/cajita";

const BASE = "/movimientocaja";

export const getAllCajitas = (): Promise<CajitaResponse[]> =>
  apiFetch(`${BASE}/find/all`);

export const saveCaja = (data: CajitaRequest): Promise<CajitaResponse> =>
  apiFetch(`${BASE}/save`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const finalizarCaja = (
  id: number,
  data: { pesoFinal: number }
): Promise<CajitaResponse> =>
  apiFetch(`${BASE}/delete/${id}`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
