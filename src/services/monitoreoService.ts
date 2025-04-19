import { apiFetch } from "@/lib/api";
import { Monitoreo } from "@/types/monitoreo";

const MONITOREO_BASE = "/dispositivo";

export const getAllMonitoreo = (): Promise<Monitoreo[]> =>
  apiFetch(`${MONITOREO_BASE}/find/all`);
