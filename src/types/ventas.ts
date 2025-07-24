import { Cuy as CuyResponse } from "./cuy";

export type Ventas = VentasRequest & {
  id: number;
};

export type VentasRequest = {
  cuyes: Cuy[];
  precioTotal: number;
  cantidadCuy: number;
  documento: string;
  nombreRazonSocial: string;
  direccion: string;
  descripcion: string;
};

export type Cuy = {
  id: number;
  precio: number;
};

export interface VentasResponse {
  id: number;
  cantidad: number;
  total: number;
  documento: string;
  nombreRazonSocial: string;
  direccion: string;
  descripcion: string;
  detalleVentas: DetalleVenta[];
}

interface DetalleVenta {
  id: number;
  cuy: CuyResponse;
}
