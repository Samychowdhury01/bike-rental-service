import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middlewares/validateRequest';
import { bookingValidationSchemas } from '../booking/booking.validation';
import { PaymentControllers } from './payment.controller';

const router = Router();

// make advance payment
router.post(
  '/advance-payment',
  auth(USER_ROLE.user),
  validateRequest(bookingValidationSchemas.createBookingValidationSchema),
  PaymentControllers.advancePayment,
);

router.post(
  '/',
  auth(USER_ROLE.user),
  PaymentControllers.makePayment,
);
// confirmation
router.post('/confirm', PaymentControllers.isConfirmed);

// cancelation
router.post('/cancel', PaymentControllers.isCanceled);

export const PaymentRoutes = router;
