import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersRepository } from "./users.repository";
import { GetUserDto } from "./dto/get-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UserDocument} from "@app/common";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    console.log("HASHED PASSWORD FOR CREATED USER: ", hashedPassword);

    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async getCurrentUser(getUserDto: GetUserDto): Promise<UserDocument> {
    return this.usersRepository.findOne(getUserDto);
  }

  async findOne(_id: string): Promise<UserDocument> {
    return this.usersRepository.findOne({ _id });
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.usersRepository.findOneAndUpdate({ _id }, updateUserDto);
  }

  async remove(_id: string): Promise<UserDocument> {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto): Promise<void> {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      console.log("VALIDATE CREATE USER DTO ERROR: ", error);
      return;
    }
    throw new UnauthorizedException("User already exists");
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException("Credentials are not valid");
    }
    return user;
  }
}
