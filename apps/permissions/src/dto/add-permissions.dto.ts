import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';

class PermissionInput {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AddPermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionInput)
  permissions: PermissionInput[];
}
