import { z } from 'zod';

const ReservationItemSchema = z.object({
  id: z.uuid(),
  quantity: z.number(),
});

export const ReserveStockCommandSchema = z.object({
  reservationId: z.string().min(1),
  products: z.array(ReservationItemSchema).nonempty(),
});

export type ReserveStockCommand = z.infer<typeof ReserveStockCommandSchema>;