export type Cuy = CuyRequest & {
  id: number;
};

export type CuyRequest = {
  edad: number;
  fechaRegistro: string;
  categoria: string;
  sexo: string;
  estado: string;
};
