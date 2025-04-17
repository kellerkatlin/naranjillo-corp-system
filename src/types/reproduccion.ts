export type Reproduccion = ReproduccionRequest & {
  id: number;
};

export type ReproduccionRequest = {
  cantidadHijos: number;
  fechaReproduccion: string;
  fechaParto: string;
  padre: { id: number };
  madre: { id: number };
};
