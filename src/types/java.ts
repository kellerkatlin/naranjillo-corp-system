export interface JavaRequest {
  nombre: string;
  categoria: string;
  sexo: string;
  fechaReproduccion: string;
}

export interface JavaRequestReproduccion {
  nombre: string;
  categoria: string;
  sexo: string;
  fechaReproduccion: string;
  cantidadHijasHembras: number;
  cantidadHijosMachos: number;
  cantidadHijosMuertos: number;
  cuyes: Array<{
    id: number;
  }>;
}

export interface JavaRespose {
  id: number;
  nombre: string;
  categoria: string;
  sexo: string;
  fechaReproduccion: string;
  nombreJavaOrigen: string;
  cantidadHijasHembras: number;
  cantidadHijosMachos: number;
  cantidadHijosMuertos: number;
  cuyes: Array<{
    id: number;
    nombre: string;
    sexo: "MACHO" | "HEMBRA";
    categoria: string;
    nombreJavaOrigen: string;
    fechaRegistro: string;
  }>;
}
