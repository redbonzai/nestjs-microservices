import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateChargeDto } from "@app/common";

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  // @IsString()
  // @IsNotEmpty()
  // placeId: string;
  //
  // @IsString()
  // @IsNotEmpty()
  // invoiceId: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;

  // @IsString()
  // description: string | null;
}
//   @ISDate()
//   @Type(() => Date)
//   startDate: Date;
//
//   @IsDate()
//   @Type(() => Date)
//   endDate: Date;
//
//   @IsDefined()
//   @IsNotEmptyObject()
//   @ValidateNested()
//   @Type(() => CreateChargeDto)
//   charge: CreateChargeDto;
// }
