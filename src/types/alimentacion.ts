export type Alimentacion = AlimentacionRequest & {
  id: number;
};

export type AlimentacionRequest = {
  cantidad: number;
  fechaAlimentacion: string;
  costo: number;
  javaIds: number[];

  tipoAlimentoId: number;
  unidadMedidaId: number;
};

export type AlimentacionResponse = {
  id: number;
  cantidad: number;
  fechaAlimentacion: string;
  costo: number;
  java: {
    id: number;
    nombre: string;
  };
  tipoAlimento: {
    id: number;
    nombre: string;
  };
  unidadMedida: {
    id: number;
    nombre: string;
    simbolo: string;
  };
};
