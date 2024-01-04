import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';

import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { ReservationCreationException } from './exceptions/reservation-creation.exception';
import { ErrorType } from '@app/common/enums';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly userRepository: UsersRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ): Promise<any> {
    try {
      // Convert the Observable to a Promise to await its result
      const stripeResponse = await firstValueFrom(
        this.paymentsService.send('create_charge', {
          ...createReservationDto.charge,
          email,
        }),
      );

      // Now create the reservation after getting the response
      const reservation = await this.reservationsRepository.create({
        ...createReservationDto,
        invoiceId: stripeResponse.id,
        description: 'Visit to yer moms house',
        timestamp: new Date(),
        userId,
      });

      await this.userRepository.addReservationToUser(
        userId,
        reservation._id.toString(),
      );
      // return reservation and user response
      return await this.reservationsRepository.getUserReservation(
        reservation._id.toString(),
      );
    } catch (error) {
      throw new ReservationCreationException(
        ErrorType.RESERVATION_CREATION_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
