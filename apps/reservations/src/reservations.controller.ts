import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { CreateReservationDto } from "./dto";
import { UpdateReservationDto } from "./dto";
import { JwtAuthGuard } from "@app/common/auth";
import { CurrentUser, identifierToDto, Roles, UserDto } from "@app/common";
import { GetReservationDto } from "./dto/get-reservation.dto";

@Controller("reservations")
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles("Admin")
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    // const reservation = await this.reservationsService.create(
    //   createReservationDto,
    //   user,
    // );
    await this.reservationsService.create(
      createReservationDto,
      user,
    );
    // console.log('USER RESERVATION CREATED: ', reservation);
    // const reservationDto = await identifierToDto(GetReservationDto, reservation._id, '_id');
    // return await this.reservationsService.findOne(reservationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles("Admin")
  async findAll() {
    return await this.reservationsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  async findOne(@Param("id") id: string) {
    return await this.reservationsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @Roles("Admin")
  async update(
    @Param("id") id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @Roles("Admin")
  async remove(@Param("id") id: string) {
    return await this.reservationsService.remove(id);
  }
}
