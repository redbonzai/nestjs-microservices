import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from "class-transformer";

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;
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
