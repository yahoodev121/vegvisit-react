import { Transaction } from '../../../data/models';

export async function createTransaction(
    reservationId,
    receiverEmail,
    receiverId,
    payerId,
    payerEmail,
    total,
    currency,
    transactionId,
    transactionStatus,
    sender_batch_id,
    paymentMethodId,
    transactionFee
  ) {

    const transaction = await Transaction.findOrCreate({
      where: {
        reservationId,
        paymentType: 'cancellation'
      },
      defaults: {
        //properties you want on create
        reservationId,
        receiverEmail,
        receiverId,
        payerId,
        payerEmail,
        total,
        currency,
        paymentType: 'cancellation',
        transactionId,
        transactionStatus,
        platformTransactionId: sender_batch_id,
        paymentMethodId,
        transactionFee
      }
    });
    return transaction;
}