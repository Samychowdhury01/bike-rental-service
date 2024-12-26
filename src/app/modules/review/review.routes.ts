import { Router } from 'express';
import { ReviewControllers } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';

const router = Router();

router.get('/:bikeId', ReviewControllers.getAllReviewsForSingleBike);
router.post('/', auth(USER_ROLE.user), ReviewControllers.createReview);

export const ReviewRoutes = router;
