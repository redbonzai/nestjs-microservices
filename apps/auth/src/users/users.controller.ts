import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { CurrentUser, Roles } from "@app/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { UserDocument } from "@app/common";
import { UsersService } from "./users.service";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles("Admin")
  async findAll(): Promise<UserDocument[]> {
    return await this.usersService.findAll();
  }

  @Get("current")
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: UserDocument): Promise<UserDocument> {
    return user;
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string): Promise<UserDocument> {
    return await this.usersService.findOne(id);
  }

  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return await this.usersService.update(id, updateUserDto);
  }

  async remove(@Param('id') id: string): Promise<UserDocument> {
    return await this.usersService.remove(id);
  }
}
