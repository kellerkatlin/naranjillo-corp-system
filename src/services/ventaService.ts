import { apiFetch } from "@/lib/api";
import { Ventas, VentasRequest } from "@/types/ventas";

const BASE = "/venta";

export const getAllVentas = (): Promise<Ventas[]> =>
  apiFetch(`${BASE}/find/all`);

export const createVenta = (data: VentasRequest) =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
