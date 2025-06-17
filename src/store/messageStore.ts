// src/stores/messageStore.ts
import { getMessages } from "@/services/cuyService";
import { create } from "zustand";

export interface Message {
  id: number;
  mensaje: string;
  fechaCreacion: string;
}

interface MessageStore {
  messages: Message[];
  fetchMessages: () => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  fetchMessages: async () => {
    try {
      const data = await getMessages();
      set({ messages: data });
    } catch (e) {
      console.error("Error al obtener mensajes:", e);
    }
  },
}));
