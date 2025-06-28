import { apiFetch } from "@/lib/api";

import { CajitaRequest, CajitaResponse } from "@/types/cajita";

const BASE = "/cajita";

export const getAllCajitas = (): Promise<CajitaResponse[]> =>
  apiFetch(`${BASE}/find/all`);

export const createCajita = (data: CajitaRequest): Promise<CajitaResponse> =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCajita = (
  id: number,
  data: CajitaRequest
): Promise<CajitaResponse> =>
  apiFetch(`${BASE}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
