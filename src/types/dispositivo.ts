export type Dispositivo = DispositivoRequest & {
  id: number;
};

export type DispositivoRequest = {
  nombreDispositivo: string;
  hum1: number;
  hum2: number;
  hum3: number;
  hum4: number;
  temp5: number;
};
