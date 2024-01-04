import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorType } from '@app/common';

export class CreatedUserValidationException extends HttpException {
    constructor(errorType: ErrorType, statusCode: HttpStatus) {
        const responseBody = {
            error: 'ERecently created user could not be validated',
            errorType,
            statusCode,
        };
        super(responseBody, statusCode);
    }
}
