import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { ReservationDocument } from './models/reservation.schema';
import { AbstractDocument } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReservationsRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(ReservationsRepository.name);
  private reservationModel: Model<ReservationDocument>;
  constructor(
    @InjectModel(ReservationDocument.name)
    reservationModel: Model<ReservationDocument>,
  ) {
    super(reservationModel);
    this.reservationModel = reservationModel;
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
          'user.password': 0, // Exclude the password field
        },
      },
    ]);
    console.log('GET USER RESERVATION RESPONSE; ', result);

    return result[0]; // Assuming you're interested in a single reservation
  }

  async allReservationsWithUsers(): Promise<any[]> {
    return this.reservationModel.aggregate([
      {
        $addFields: {
          convertedUserId: { $toObjectId: '$userId' },
        },
      },
      {
        $lookup: {
          from: 'userdocuments',
          localField: 'convertedUserId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          'user.password': 0,
        },
      },
    ]);

    // const objectId = new mongoose.Types.ObjectId(userId);
    // return this.reservationModel.aggregate([
    //   // {
    //   //   $addFields: {
    //   //     convertedUserId: objectId, // { $toObjectId: '65966e5f80d88f17ea17dc22' }, // Convert userId to ObjectId
    //   //   },
    //   // },
    //   {
    //     $lookup: {
    //       from: 'userdocuments', // The name of the user collection
    //       localField: 'convertedUserId',
    //       foreignField: '_id',
    //       as: 'user',
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: '$user',
    //       preserveNullAndEmptyArrays: true, // Handle cases where no user is found
    //     },
    //   },
    //   {
    //     $project: {
    //       'user.password': 0, // Exclude the password field
    //     },
    //   },
    // ]);
  }
}
