export interface LecturaRequest {
  hum1: number;
  hum2: number;
  hum3: number;
  hum4: number;
  temp5: number;
  ph: number;
}

export interface LecturaGeneralResponse {
  id: number;
  temperatura: number;
  ph: number;
  fechaHora: string;
}
