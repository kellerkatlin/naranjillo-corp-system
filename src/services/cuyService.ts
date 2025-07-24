import { apiFetch } from "@/lib/api";
import { Message } from "@/store/messageStore";
import { Cuy, CuyPadre, CuyRequest } from "@/types/cuy";
import { SanidadCuy } from "@/types/sanidad";

const CUY_BASE = "/cuy";

export const getAllCuyes = (): Promise<Cuy[]> =>
  apiFetch(`${CUY_BASE}/find/all`);

export const getCuyAvailable = (): Promise<CuyPadre[]> =>
  apiFetch(`/javacuy/cuyes/estado/VIVO`);

export const getCuyById = (id: number): Promise<Cuy> =>
  apiFetch(`${CUY_BASE}/find/${id}`);

export const createCuy = (data: CuyRequest): Promise<Cuy> =>
  apiFetch(`${CUY_BASE}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCuy = (id: number, data: CuyRequest): Promise<Cuy> =>
  apiFetch(`${CUY_BASE}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCuy = (id: number): Promise<void> =>
  apiFetch(`${CUY_BASE}/delete/${id}`, {
    method: "DELETE",
  });

export const getMessages = (): Promise<Message[]> =>
  apiFetch(`${CUY_BASE}/notificaciones`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getSanidadesByCuy = (idCuy: number): Promise<SanidadCuy> =>
  apiFetch(`${CUY_BASE}/sanidades/${idCuy}`, {
    method: "GET",
  });
