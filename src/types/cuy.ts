export type Cuy = CuyRequest & {
  id: number;
};

export type CuyRequest = {
  edad: number;
  fechaRegistro: string;
  categoria: string;
  sexo: string;
  horaRegistro: string;
  java: number;
  estado: string;
};

export type CuyPadre = {
  id: number;
  nombre: string;
  sexo: string;
  edad: number;
  fechaRegistro: string;
  horaRegistro: string;
  java: string;
  categoria: string;
  estado: string;
};
