export interface Sanidad {
  id: 1;
  fechaYHora: string;
  nombreMedicamento: string;
  incidencia: string;
  dosis: number;
  costo: number;
  cuy: {
    id: number;
  };
}

export type SanidadRequest = Omit<Sanidad, "id">;

export interface SanidadCuy {
  id: number;
  edad: number;
  sexo: string;
  fechaRegistro: string;
  categoria: string;
  estado: string;
  peso: number;
  idJavaOrigen: number;
  nombreJavaOrigen: string;
  sanidades: Sanidades[];
}

export interface Sanidades {
  id: number;
  fechaYHora: string;
  nombreMedicamento: string;
  incidencia: string;
  dosis: string;
  costo: number;
}
