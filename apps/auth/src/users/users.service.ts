import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument } from '@app/common';
import { RolesRepository } from '@roles/roles.repository';
import { Types } from 'mongoose';
import { UpdateUserDto } from '@auth/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // Convert role strings to ObjectId's
    const roleIds = await this.rolesRepository.getRoleIdsFromRoleNames(
      this.rolesRepository,
      createUserDto.roles,
    );

    return await this.usersRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      roles: roleIds,
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

  async update(_id: GetUserDto, userDto: UpdateUserDto): Promise<UserDocument> {
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, 10);
    }

    // Perform the update
    return await this.usersRepository.findOneAndUpdate(
      { _id },
      { $set: userDto },
    );
  }

  private async userExists(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      email: createUserDto.email,
    });

    return Object(user).length > 0;
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return user;
  }

  async addReservationToUser(userId: string, resId: string): Promise<void> {
    return await this.usersRepository.addReservationToUser(userId, resId);
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    return await this.usersRepository.getUserPermissions(userId);
  }

  async getUserRolesAndPermissions(userId: string): Promise<string[]> {
    return await this.usersRepository.getUserRolesAndPermissions(userId);
  }

  async updateUserRoles(
    userId: Types.ObjectId,
    roles: string[],
  ): Promise<UserDocument> {
    // get all roles and permissions,
    // user's roles to existing roles
    return await this.usersRepository.syncUserRoles(userId, roles);
  }

  async updateUserPermissions(
    userId: Types.ObjectId,
    roleId: Types.ObjectId,
    permissionNames: string[],
  ): Promise<UserDocument> {
    // get all roles and permissions,
    // sync the permissions with the roles
    return await this.usersRepository.syncPermissionsOnRoleId(
      userId,
      roleId,
      permissionNames,
    );
  }
}
