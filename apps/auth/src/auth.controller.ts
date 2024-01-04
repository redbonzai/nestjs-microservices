import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {CurrentUser, identifierToDto, JwtToken} from '@app/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDocument } from '@app/common';
import { UsersService } from './users/users.service';
import { GetUserDto } from './users/dto/get-user.dto';
import { Logout } from "./interfaces/logout.interface";
import {string} from "joi";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDocument> {
    await this.authService.login(user, response);
    // response.send(user);
    const getUserDro: GetUserDto = await identifierToDto(
        GetUserDto,
      user._id.toString(),
        '_id'
    );
    return this.usersService.getCurrentUser(getUserDro);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() userDto: GetUserDto) {
    console.log('PAYLOAD IN AUTHENTICATE: ', userDto);
    return userDto;
  }



  @Post('logout')
  logout(@JwtToken() jwt: string, @Res() response: Response): string {
    return this.authService.clearToken(jwt, response);
  }
}
