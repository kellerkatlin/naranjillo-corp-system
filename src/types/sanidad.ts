export interface Sanidad {
  id: number;
  tipoMedicina: string;
  incidencia: string;
  comentario: string;
  unidadMedida: string;
  fecha: string;
}

export type SanidadRequest = Omit<Sanidad, "id">;
