export interface CajitaResponse {
  id: number;
  numCaja: number;
  pesoInicial: number;
  pesoFinal: number;
  costo: number;
  humedades: Humedades[];
  lecturas: LecturaResponse[];
  estadoMovimiento: EstadoMovimiento;
}

interface Humedades {
  id: number;
  valor: number;
  fechaHora: string;
}
export interface CajitaRequest {
  numCaja: number;
  pesoInicial: number;
  pesoFinal: number;
  costo: number;
  estadoMovimiento: EstadoMovimiento;
}

export enum EstadoMovimiento {
  INICIADO = "INICIADO",
  FINALIZADO = "FINALIZADO",
}
export interface LecturaResponse {
  id: number;
  valor: number;
  fechaHora: string;
}
