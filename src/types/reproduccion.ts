export type Reproduccion = ReproduccionRequest & {
  id: number;
};

export type ReproduccionRequest = {
  nombreCuyera: string;
  cantidadHijosMuertos: number;
  cantidadHijos: number;
  fechaReproduccion: string;
  fechaParto: string;
  estado: string;
  padre: { id: number };
  hembras: { id: number }[];
};
