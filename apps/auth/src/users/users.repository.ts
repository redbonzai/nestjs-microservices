import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as mongoose from 'mongoose';
import { UserDocument } from "@app/common";

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);
  private readonly userModel: Model<UserDocument>;

  constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
    super(userModel);
    this.userModel = userModel;
  }

  async userReservations(userId: string): Promise<any> {
    const result = await this.userModel.aggregate([
      { $match: { "_id": new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "reservationdocuments",
          localField: "reservationIds",
          foreignField: "_id",
          as: "reservations"
        }
      }
    ]);

    return result[0]; // result[0] contains the user with their reservations
  }

  async addReservationToUser(userId: string, reservationId: string): Promise<void> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const reservationObjectId = new mongoose.Types.ObjectId(reservationId);

    await this.userModel.updateOne(
        { _id: userObjectId },
        { $addToSet: { reservationIds: reservationObjectId } }
    );
  }
}
