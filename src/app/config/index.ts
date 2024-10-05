import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env : process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  sault_rounds: process.env.SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  amarPay_store_id : process.env.STORE_ID,
  amarPay_signature_key : process.env.SIGNATURE_KEY,
  amarPay_payment_url : process.env.PAYMENT_URL as string,
  success_url : process.env.SUCCESS_URL,
  cancel_url : process.env.CANCEL_URL,
  redirect_url : process.env.REDIRECT_URL,
};
