import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { ReservationDocument } from './models/reservation.schema';
import { AbstractDocument } from '@app/common';

@Injectable()
export class ReservationsRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(ReservationsRepository.name);
    private readonly reservationModel: Model<ReservationDocument>;
  constructor(
    @InjectModel(ReservationDocument.name)
    reservationModel: Model<ReservationDocument>,
  ) {
    super(reservationModel);
    this.reservationModel = reservationModel;
  }

  async getUserReservationByReservationId(userId: string, reservationId: string): Promise<ReservationDocument | null> {
    return this.reservationModel.findOne({ userId, _id: reservationId }).exec();
  }

  async getUserReservation(reservationId: string): Promise<any> {
    const objectId = new mongoose.Types.ObjectId(reservationId); // Convert string to ObjectId

    const result = await this.reservationModel.aggregate([
      { $match: { _id: objectId } },
      {
        $addFields: {
          convertedUserId: { $toObjectId: '$userId' }, // Convert userId to ObjectId
        },
      },
      {
        $lookup: {
          from: 'userdocuments', // The name of the user collection
          localField: 'convertedUserId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true, // Handle cases where no user is found
        },
      },
      {
        $project: {
          'user.password': 0, // Exclude the password field from the user subdocument
        },
      },
    ]);

    return result[0]; // Assuming you're interested in a single reservation
  }
}
