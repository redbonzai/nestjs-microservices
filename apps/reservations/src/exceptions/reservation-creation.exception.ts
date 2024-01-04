// custom-exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorType } from '@app/common';

export class ReservationCreationException extends HttpException {
  constructor(errorType: ErrorType, statusCode: HttpStatus) {
    const responseBody = {
        error: 'Exception ocurred while creating a reservation',
        errorType,
        statusCode,
    };
    super(responseBody, statusCode);
}
}
