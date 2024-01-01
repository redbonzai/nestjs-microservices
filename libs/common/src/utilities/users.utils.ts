import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { GetUserDto } from 'apps/auth/src/users/dto/get-user.dto';

export async function transformUserIdToDto(
  userId: string,
): Promise<GetUserDto> {
  const getUserDto = plainToClass(GetUserDto, { _id: userId });

  const errors = await validate(getUserDto);
  if (errors.length > 0) {
    throw new Error(`Validation error: ${JSON.stringify(errors)}`);
  }
  return getUserDto;
}
