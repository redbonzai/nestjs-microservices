// custom-exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class ReservationCreationException extends HttpException {
  // private _internalServerError: HttpStatus.INTERNAL_SERVER_ERROR;
  constructor(
    message: string,
    errorType: HttpStatus.INTERNAL_SERVER_ERROR,
    status: HttpStatus = errorType,
  ) {
    super(`Error Type: ${errorType} - ${message}`, status);
  }

  // async create(
  //   createReservationDto: CreateReservationDto,
  //   { email, _id: userId }: UserDto,
  // ): Promise<any> {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //
  //   try {
  //     // ... your existing logic ...
  //
  //     await session.commitTransaction();
  //     return response;
  //   } catch (error) {
  //     await session.abortTransaction();
  //     throw new ReservationCreationException('Failed to create reservation');
  //   } finally {
  //     session.endSession();
  //   }
  // }
}
