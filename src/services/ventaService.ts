import { apiFetch } from "@/lib/api";
import { CuyPadre } from "@/types/cuy";
import { Ventas, VentasRequest, VentasResponse } from "@/types/ventas";

const BASE = "/venta";

export const getAllVentas = (): Promise<VentasResponse[]> =>
  apiFetch(`${BASE}/find/all`);

export const createVenta = (data: VentasRequest): Promise<Ventas[]> =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const listarCuyesDisponibles = (): Promise<CuyPadre[]> =>
  apiFetch("/javacuy/cuyes/vivos/categoria/ENGORDE");
