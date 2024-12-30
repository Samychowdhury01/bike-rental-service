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

router.post('/', auth(USER_ROLE.user), PaymentControllers.makePayment);
// confirmation
router.post('/confirm', PaymentControllers.isConfirmed);

// cancel
router.post('/cancel', PaymentControllers.isCanceled);

// get user payment history
router.get(
  '/history',
  auth(USER_ROLE.user),
  PaymentControllers.getPaymentHistory,
);

// admin will get all the payment history
router.get(
  '/admin/history',
  auth(USER_ROLE.admin),
  PaymentControllers.getAllPaymentHistory,
);

router.put(
  '/use-points/:rentalId',
  auth(USER_ROLE.user),
  PaymentControllers.usePoints,
);

export const PaymentRoutes = router;
