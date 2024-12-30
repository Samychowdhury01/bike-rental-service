import { Router } from 'express';
import { ReviewControllers } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';

const router = Router();
router.post('/', auth(USER_ROLE.user), ReviewControllers.createReview);
router.get('/bike/:bikeId', ReviewControllers.getAllReviewsForSingleBike);
router.get('/user-review', auth(USER_ROLE.user), ReviewControllers.getUserReviews)
router.get('/admin', auth(USER_ROLE.admin), ReviewControllers.getAllReviews)


export const ReviewRoutes = router;
