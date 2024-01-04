import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument } from '@app/common';
import { CreatedUserValidationException } from './exceptions/created-user-validation.exception';
import { ErrorType } from '@app/common/enums';
import {HttpStatus} from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreatedUser(createUserDto);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    console.log('HASHED PASSWORD FOR CREATED USER: ', hashedPassword);

    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async getCurrentUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  async update(_id: string, user: CreateUserDto): Promise<UserDocument> {
    console.log('USER IN UPDATE: ', user);
    return this.usersRepository.findOneAndUpdate({ _id }, { $set: user });
  }

  private async validateCreatedUser(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      console.log('VALIDATE CREATE USER DTO ERROR: ', error);
      throw new CreatedUserValidationException(ErrorType.USER_VALIDATION_ERROR, HttpStatus.BAD_REQUEST)
      return;
    }
    throw new UnauthorizedException('User already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return user;
  }

  async addReservationToUser(userId: string, resId: string): Promise<void> {
    return await this.usersRepository.addReservationToUser(userId, resId);
  }
}
