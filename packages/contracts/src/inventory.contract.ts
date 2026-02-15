import { z } from 'zod';

const ReservationItemSchema = z.object({
  id: z.uuid(),
  quantity: z.number().int().positive(),
});

export const ReserveStockEventSchema = z.object({
  reservationId: z.uuid(),
  products: z.array(ReservationItemSchema).nonempty(),
});

export type ReserveStockEvent = z.infer<typeof ReserveStockEventSchema>;

export const ReserveStockResponseSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    data: z.object({
      reservationId: z.uuid(),
      created: z.date(),
      expires: z.date()
    }),
    error: z.undefined().optional()
  }),
  z.object({
    success: z.literal(false),
    error: z.object({
      message: z.string().nonempty(),
      reason: z.array(
        z.object({
          id: z.string(),
          requested: z.number(),
          stock: z.number(),
        })
      ),
    }),
    data: z.undefined().optional()
  })
])

export type ReserveStockResponse = z.infer<typeof ReserveStockResponseSchema>

// --- Commit Stock Reservations ---

export const CommitStockEventSchema = z.object({
  reservationId: z.string().min(1),
});

export type CommitStockEvent = z.infer<typeof CommitStockEventSchema>;

export const CommitStockResponseSchema = z.object({
  reservationId: z.uuid(),
  committedAt: z.date(),
  affectedProducts: z.array(z.string()),
});

export type CommitStockResponse = z.infer<typeof CommitStockResponseSchema>;

export const ReleaseStockEventSchema = z.object({
  reservationId: z.string().min(1),
});
export type ReleaseStockReservation = z.infer<typeof ReleaseStockEventSchema>;