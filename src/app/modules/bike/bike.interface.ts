import { Model } from "mongoose";

export type TBike = {
    name : string;
    description:string;
    pricePerHour: number;
    isAvailable?: boolean;
    cc: number;
    year: number;
    model: string;
    brand : string;
    isDeleted?: boolean
}

export interface IBikeModel extends Model<TBike> {
    isBikeExists(id: string): Promise<TBike | null>;
  } 