export const Command = {
  ReserveStock: 'inventory.stock.reserve',
  CommitReservation: 'inventory.stock.commit',
  ReleaseStock: 'inventory.stock.release',
} as const

export const InventoryEvents = {
  InventoryReserved: 'inventory.reserved',
  InventoryExhausted: 'inventory.exhausted',
  InventoryCommitted: 'inventory.committed',
  InventoryReleased: 'inventory.released',
  InventoryUpdated: 'inventory.updated'
}

export const OrderEvents = {
  OrderPlaced: 'order.placed',
  OrderCancelled: 'order.cancelled',
  OrderCompleted: 'order.completed'
}

export const PaymentEvents = {
  PaymentPending: 'payment.pending',
  PaymentSucceeded: 'payment.succeeded',
  PaymentFailed: 'payment.failed'
}