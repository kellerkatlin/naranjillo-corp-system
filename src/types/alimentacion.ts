export type Alimentacion = AlimentacionRequest & {
  id: number;
};

export type AlimentacionRequest = {
  tipoAlimento: string;
  cantidad: string;
  fechaAlimentacion: string;
  unidadMedida: string;
  reproduccion: {
    id: number;
  };
};
