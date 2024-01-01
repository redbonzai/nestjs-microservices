import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CurrentUser } from '@app/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDocument } from '@app/common';
import { UsersService } from './users/users.service';
import { transformUserIdToDto } from '@app/common';
import { GetUserDto } from "./users/dto/get-user.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDocument> {
    await this.authService.login(user, response);
    // response.send(user);

    const getUserDro: GetUserDto = await transformUserIdToDto(
      user._id.toString(),
    );
    return this.usersService.getUser(getUserDro);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() payload: any) {
    return payload.user;
  }
}
