import { apiFetch } from "@/lib/api";
import { CuyPadre } from "@/types/cuy";
import {
  JavaRequest,
  JavaRequestReproduccion,
  JavaRespose,
} from "@/types/java";

const BASE = "/java";
const BASE_CUY = "/javacuy";
export const getCuyesPadres = (
  sexo: string,
  categoriaName: string
): Promise<CuyPadre[]> =>
  apiFetch(`${BASE_CUY}/cuyes/vivos/categoria/${categoriaName}/sexo/${sexo}`);

//localhost:8080/javacuy/cuyes/vivos/categoria/{categoria}/sexo/{sexo}

export const createJavaCuy = (data: JavaRequest) =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const createJavaCuyReproduccion = (data: JavaRequestReproduccion) =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getAllJava = (sexo: string): Promise<JavaRespose[]> =>
  apiFetch(`${BASE_CUY}/javas/sexo/${sexo}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
