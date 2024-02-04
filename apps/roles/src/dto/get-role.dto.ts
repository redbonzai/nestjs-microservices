import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GetRoleDto {
  @IsString()
  @IsNotEmpty()
  _id: string;
  name: string;

  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissions?: string[];
}
