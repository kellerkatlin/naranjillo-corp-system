export interface CajitaResponse {
  id: number;
  numero: number;
  pesoInicial: number;
  pesoFinal: number;
  costo: number;
  lecturas: LecturaResponse[];
}

export interface CajitaRequest {
  numero: number;
  pesoInicial: number;
  pesoFinal: number;
  costo: number;
}

export interface LecturaResponse {
  id: number;
  valor: number;
  fechaHora: string;
}
