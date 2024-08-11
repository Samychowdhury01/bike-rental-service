import { Model } from 'mongoose';

export type TRole = 'admin' | 'user';
export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: TRole;
  isDeleted?: boolean;
};

// for custom statics method
export interface TUserModel extends Model<TUser> {
  isUserExist(id: string): Promise<TUser | null>;
  isPasswordMatched(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
