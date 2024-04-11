import { TransactionHistory, Reservation, CurrencyRates, Currencies } from '../../data/models';
import sequelize from '../../data/sequelize';
import { convert } from '../../helpers/currencyConvertion';

import Sequelize from 'sequelize';

export async function completedTransactions(userId,bases,toCurrency) {
    let dataItems = [];
    let ratesDatas, currencyRates;
    let convertedTotal = 0, tot =0;
    var rates, ratesData = {};
    const dataCurrencyRates = await CurrencyRates.findAll();
    const base = await Currencies.findOne({ where: { isBaseCurrency: true } });
    if(dataCurrencyRates){
      dataCurrencyRates.map((item) => {
        ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
      })
    }
    rates = JSON.stringify(ratesData);
    ratesDatas = {
      base: base.symbol,
      rates
    };

    if(ratesDatas.rates != null){
        currencyRates = JSON.parse(ratesDatas.rates);
    }


    const data = await TransactionHistory.findAll({
        where: {
            userId
        }
    });
    if (data && data.length > 0) {
        await Promise.all(data.map(async (item, index) => {
            let dataItem = {};

            tot = Number(item.amount);
            convertedTotal = await convert(bases, currencyRates, tot, item.currency, toCurrency);

            dataItem = {
                'Date': item.createdAt,
                'Type': 'Payout',
                'ReservationId': item.reservationId,
                'PayoutEmail': item.payoutEmail,
                'Amount': convertedTotal,
                'Currency': toCurrency
            };
            dataItems.push(dataItem);
        }));
    }
    return dataItems;
}

export async function futureTransactions(hostId,bases,toCurrency) {
    const Op = Sequelize.Op;
    let dataItems = [];
    let convertedTotal = 0, tot =0;
    let ratesDatas, currencyRates;

    var rates, ratesData = {};
    const dataCurrencyRates = await CurrencyRates.findAll();
    const base = await Currencies.findOne({ where: { isBaseCurrency: true } });
    if(dataCurrencyRates){
      dataCurrencyRates.map((item) => {
        ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
      })
    }
    rates = JSON.stringify(ratesData);
    ratesDatas = {
      base: base.symbol,
      rates
    };

    if(ratesDatas.rates != null){
        currencyRates = JSON.parse(ratesDatas.rates);
    }

    const data = await Reservation.findAll({
        where: {
            hostId,
            paymentState: 'completed',
            [Op.or]: [
                {
                    reservationState: 'approved'
                },
                {
                    reservationState: 'completed'
                },
                {
                    reservationState: 'cancelled'
                }
            ],
            id: {
                [Op.notIn]: [
                    sequelize.literal("SELECT reservationId FROM TransactionHistory")
                ]
            }
        }
    });
    if (data && data.length > 0) {
        await Promise.all(data.map(async (item, index) => {
            let dataItem = {};
            tot = Number(item.total - item.hostServiceFee);
            convertedTotal = await convert(bases, currencyRates, tot, item.currency, toCurrency);
            dataItem = {
                'Estimated Date': item.checkOut,
                'Type': 'Reservation',
                'ReservationId': item.id,
                'Estimated Amount': convertedTotal,
                'Currency': toCurrency
            };

            dataItems.push(dataItem);
        }));
    }

    return dataItems;
}

export async function grossEarnings(hostId,bases,toCurrency) {
    const Op = Sequelize.Op;
    let dataItems = [];
    let ratesDatas, currencyRates;
    let convertedTotal = 0, tot =0;
    var rates, ratesData = {};
    const dataCurrencyRates = await CurrencyRates.findAll();
    const base = await Currencies.findOne({ where: { isBaseCurrency: true } });
    if(dataCurrencyRates){
      dataCurrencyRates.map((item) => {
        ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
      })
    }
    rates = JSON.stringify(ratesData);
    ratesDatas = {
      base: base.symbol,
      rates
    };

    if(ratesDatas.rates != null){
        currencyRates = JSON.parse(ratesDatas.rates);
    }

    const data = await Reservation.findAll({
        where: {
            hostId,
            paymentState: 'completed',
            [Op.or]: [
                {
                    reservationState: 'completed'
                },
                {
                    reservationState: 'cancelled'
                }
            ]

        },
        include: [
            {
                model: TransactionHistory,
                as: 'transactionHistory',
                required: true,
                where: {
                    userId: hostId
                }
            }
        ]
    });

    if (data && data.length > 0) {
        await Promise.all(data.map(async (item, index) => {
            let dataItem = {};
            // tot = Number(item.total + item.hostServiceFee);
            tot = Number(item.total);
            convertedTotal = await convert(bases, currencyRates, tot, item.currency, toCurrency);
            dataItem = {
                'Date': item.transactionHistory && item.transactionHistory[0] ? item.transactionHistory[0].createdAt : 'Pending',
                'Type': 'Gross Earnings',
                'ReservationId': item.id,
                'Amount with Host Service Fee': convertedTotal,
                'Currency': toCurrency
            };
            dataItems.push(dataItem);
        }));
    }
    return dataItems;
}