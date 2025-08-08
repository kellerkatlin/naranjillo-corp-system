import { Cuy } from "./cuy";

export interface ReporteVentasRequest {
  fechaDesde: string;
  fechaHasta: string;
}

export interface ReporteGuardarIngresosRequest {
  luz: number;
  agua: number;
  internet: number;
}

export interface ReporteVentasResponse {
  cantidad: number;
  total: number;
  medioPago: string;
  documento: string;
  nombreRazonSocial: string;
  direccion: string;
  descripcion: string;
  fechaVenta: string;
}

export interface ReporteIgresosEgresosResponse {
  totalVentas: number;
  totalSanidad: number;
  totalAlimento: number;
  totalEgresosOtros: number;
}

export interface ReporteJavaResponse {
  id: number;
  nombre: string;
  categoria: string;
  sexo: string;
  fechaReproduccion: string;
  cantidadHijasHembras: number;
  cantidadHijosMachos: number;
  cantidadHijosMuertos: number;
  cuyes: Cuy[];
}

export interface ReporteCuyResponse {
  id: number;
  edad: number;
  sanidades: [];
  sexo: string;
  fechaRegistro: string;
  categoria: string;
  estado: string;
  peso: number;
  idJavaOrigen: number;
  nombreJavaOrigen: string;
  precio: number;
}
