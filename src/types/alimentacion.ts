export type Alimentacion = AlimentacionRequest & {
  id: number;
};

export type AlimentacionRequest = {
  tipoAlimento: string;
  cantidad: string;
  fechaAlimentacion: string;
  unidadMedida: string;
  nombreReproduccion?: string;
  reproduccion: {
    id: number;
  };
};
