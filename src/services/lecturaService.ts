import { apiFetch } from "@/lib/api";

import { LecturaGeneralResponse, LecturaRequest } from "@/types/lectura";

const BASE = "/lecturas";
const BASE_2 = "/lecturageneral";

export const getAllLecturas = (): Promise<LecturaGeneralResponse[]> =>
  apiFetch(`${BASE_2}/find/all`);

export const createLectura = (data: LecturaRequest): Promise<void> =>
  apiFetch(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
