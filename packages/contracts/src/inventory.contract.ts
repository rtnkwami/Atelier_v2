import { z } from 'zod';

const ReservationItemSchema = z.object({
  id: z.uuid(),
  quantity: z.number().int().positive(),
});

export const ReserveStockCommandSchema = z.object({
  reservationId: z.uuid(),
  products: z.array(ReservationItemSchema).nonempty(),
});

export type ReserveStockCommand = z.infer<typeof ReserveStockCommandSchema>;