import { apiFetch } from "@/lib/api";
import { Cuy, CuyPadre } from "@/types/cuy";
import {
  JavaRequest,
  JavaRequestReproduccion,
  JavaRespose,
} from "@/types/java";
import { Reproduccion } from "@/types/reproduccion";

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

export const getAllReproducciones = (): Promise<Reproduccion[]> => {
  return apiFetch(`${BASE}/reproducciones`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createJavaCuyReproduccion = (data: JavaRequestReproduccion) =>
  apiFetch(`${BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const updateJavaCuyReproduccion = (
  id: number,
  data: JavaRequestReproduccion
) =>
  apiFetch(`${BASE}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getAllJava = (
  sexo: string,
  categoria?: string
): Promise<JavaRespose[]> => {
  const url =
    categoria && categoria !== "TODOS"
      ? `${BASE_CUY}/javas/categoria/${categoria}/sexo/${sexo}`
      : `${BASE_CUY}/javas/sexo/${sexo}`;

  return apiFetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getAllJavas = (): Promise<JavaRespose[]> =>
  apiFetch(`${BASE}/find/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getAllJavaByCategoria = (
  categoria: string
): Promise<JavaRespose[]> =>
  apiFetch(`${BASE_CUY}/javas/categoria/${categoria}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getJavasDisponibles = (
  sexo: string,
  categoria: string
): Promise<JavaRespose[]> =>
  apiFetch(`${BASE_CUY}/javas/categoria/${categoria}/sexo/${sexo}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getCuyesSinJava = (): Promise<Cuy[]> =>
  apiFetch(`${BASE_CUY}/sin-java`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const finalizarJavaCuy = (id: number, data: JavaRequestReproduccion) =>
  apiFetch(`${BASE}/delete/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const cambioPadreDeJava = (idJava: number, idCuy: number) =>
  apiFetch(`${BASE}/update/java/${idJava}/cuy/${idCuy}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getCuySinJava = (categoria: string): Promise<Cuy[]> =>
  apiFetch(`${BASE_CUY}/cuyes/sin-java/categoria/${categoria}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
