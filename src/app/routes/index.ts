import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { BikeRoutes } from '../modules/bike/bike.routes';
import { BookingRoutes } from '../modules/booking/booking.routes';
import { CouponRoutes } from '../modules/coupon/coupon.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';
import { ReviewRoutes } from '../modules/review/review.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/bikes',
    route: BikeRoutes,
  },
  {
    path: '/rentals',
    route: BookingRoutes,
  },
  {
    path: '/coupons',
    route: CouponRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
