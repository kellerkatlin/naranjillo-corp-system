import { apiFetch } from "@/lib/api";
import {
  ReporteCuyResponse,
  ReporteGuardarIngresosRequest,
  ReporteIgresosEgresosResponse,
  ReporteJavaResponse,
  ReporteVentasRequest,
  ReporteVentasResponse,
} from "@/types/reporte";

const BASE = "/reportes";

export const reporteVentas = (
  body: ReporteVentasRequest
): Promise<ReporteVentasResponse[]> =>
  apiFetch(`${BASE}/ventas`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const reporteIgresosEgresos = (
  body: ReporteVentasRequest
): Promise<ReporteIgresosEgresosResponse> =>
  apiFetch(`${BASE}/ingresos-egresos`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const guardarEgresos = (
  body: ReporteGuardarIngresosRequest
): Promise<void> =>
  apiFetch(`${BASE}/guardar-egresos`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const reporteVentasDni = (
  documento: string
): Promise<ReporteVentasResponse[]> =>
  apiFetch(`${BASE}/ventasdni`, {
    method: "POST",
    body: JSON.stringify({ documento }),
  });

export const reporteJava = (
  body: ReporteVentasRequest
): Promise<ReporteJavaResponse[]> =>
  apiFetch(`${BASE}/javas`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const reporteCuy = (
  body: ReporteVentasRequest
): Promise<ReporteCuyResponse[]> =>
  apiFetch(`${BASE}/cuyes`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const reactivateJava = (idJava: number): Promise<ReporteCuyResponse[]> =>
  apiFetch(`/java/reactivate/${idJava}`, {
    method: "POST",
  });
