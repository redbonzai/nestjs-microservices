import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '@auth/users/dto/create-user.dto';
import { CreatedUserValidationException } from '@auth/users/exceptions/created-user-validation.exception';
import { ErrorType } from '@app/common/enums';

export async function validateCreateUser(createUserDto: CreateUserDto) {
  // if (await userExists(createUserDto)) {
  //   throw new CreatedUserValidationException(
  //     'User already exists',
  //     ErrorType.USER_ALREADY_EXISTS,
  //     HttpStatus.BAD_REQUEST,
  //   );
  // }

  if (!createUserDto.hasOwnProperty('roles')) {
    throw new CreatedUserValidationException(
      'User must have at least one role',
      ErrorType.USER_MUST_HAVE_AT_LEAST_ONE_ROLE,
      HttpStatus.BAD_REQUEST,
    );
  }
}
