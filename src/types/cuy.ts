export type Cuy = CuyRequest & {
  id: number;
};

export type CuyRequest = {
  id?: number | null;
  edad: number;
  peso: number;
  sexo: string;
  fechaRegistro: string;
  horaRegistro: string;
  categoria: string;
  estado: string;
  java: {
    id: number;
    nombre?: string;
  };
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
