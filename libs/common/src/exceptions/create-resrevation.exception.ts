// custom-exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorType } from './error-types.enum';

export class CreateReservationException extends HttpException {
    constructor(errorType: ErrorType, status: HttpStatus) {
        const responseBody = {
            error: 'Exception was incurred while creating a reservation',
            errorType,
            statusCode: status
        };
        super(responseBody, status);
    }
}
