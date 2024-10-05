/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../config';

export const initiatePayment = async (info: any) => {
  const url = config.amarPay_payment_url as string;
  const transactionId = `TXN ${Date.now()}`;
  //  data
  const data = {
    store_id: config.amarPay_store_id,
    tran_id: transactionId,
    success_url: `${config.redirect_url}/confirm?userId=${info.userId}&bikeId=${info.bikeId}&startTime=${info.startTime}&totalCost=${info.totalCost}&bookingId=${info.bookingId}`,
    fail_url: `${config.redirect_url}/cancel`,
    cancel_url: `${config.redirect_url}/cancel`,
    amount: info.amount,
    currency: 'BDT',
    signature_key: config.amarPay_signature_key,
    desc: 'Bike payment for ride',
    cus_name: info.name,
    cus_email: info.email,
    cus_add1: info.address,
    cus_add2: 'N/A',
    cus_city: 'N/A',
    cus_state: 'N/A',
    cus_postcode: 'N/A',
    cus_country: 'Bangladesh',
    cus_phone: info.phone,
    type: 'json',
  };

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
};
