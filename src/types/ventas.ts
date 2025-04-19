export type Ventas = VentasRequest & {
  id: number;
};

export type VentasRequest = {
  cantidad: number;
  total: number;
  cuyes: { id: number[] };
};
