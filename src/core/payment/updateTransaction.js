import Sequelize from 'sequelize';

import { Transaction, TransactionHistory } from '../../data/models';

/**
 * Updates the table Transaction or TransactionHistory with Paypal fees and the Paypal transactionStatus
 * @param {string} sender_batch_id The transation ID as specified by our platform
 * @param {string} batchStatus The Paypal batch status
 * @param {number} fees The Paypal fees
 * @param {string} payout_batch_id The Paypal payout batch id
 */
export async function updatePaypalTransaction(sender_batch_id, batchStatus, fees, payout_batch_id) {
  const Op = Sequelize.Op;
  let transactionUpdate;
  if (sender_batch_id.startsWith('Payout_')) { // It's a host payout
    transactionUpdate = await TransactionHistory.update({
      transactionStatus: batchStatus,
      fees: fees
    }, {
      where: {
        transactionId: payout_batch_id,
        platformTransactionId: sender_batch_id,
        transactionStatus: {
          [Op.notIn]: ['SUCCESS', 'DENIED']
        }
      }
    });
  }
  else if (sender_batch_id.startsWith('Refund_')) { // It's a guest refund
    transactionUpdate = await Transaction.update({
      transactionStatus: batchStatus,
      transactionFee: fees
    }, {
      where: {
        transactionId: payout_batch_id,
        platformTransactionId: sender_batch_id,
        transactionStatus: {
          [Op.notIn]: ['SUCCESS', 'DENIED']
        }
      }
    });
  }
  return transactionUpdate;
}
