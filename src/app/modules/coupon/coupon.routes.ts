import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { CouponControllers } from './coupon.controller';

const router = Router();


router.get('/', auth(USER_ROLE.admin), CouponControllers.getAllCoupons);
// get all coupons
router.post('/', auth(USER_ROLE.admin), CouponControllers.createCoupon);
// delete
router.delete('/:id', auth(USER_ROLE.admin), CouponControllers.removeCoupon);

export const CouponRoutes = router;
