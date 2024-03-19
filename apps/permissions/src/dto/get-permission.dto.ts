import { IsNotEmpty, IsString } from 'class-validator';

export class GetPermissionDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  dsecription: string;
}
