import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createUserIntoDB = async (payload: TUser) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new Error('User already exist');
    }
    const result = await User.create(payload)
    return result;
};
export const AuthServices = {
  createUserIntoDB,
};
