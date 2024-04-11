import { TransactionHistory } from '../../../data/models';

export async function createTransactionHistory(
    reservationId, 
    hostEmail, 
    payoutId, 
    amount, 
    currency,
    userId,
    paymentMethodId,
    batchId,
    batchStatus,
    sender_batch_id
  ) {
      const transactions = await TransactionHistory.create({
        reservationId, 
        payoutId,
        payoutEmail: hostEmail, 
        amount, 
        currency,
        userId,
        paymentMethodId,
        transactionId: batchId,
        transactionStatus: batchStatus,
        platformTransactionId: sender_batch_id
      });
}