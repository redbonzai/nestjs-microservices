import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "../../../types/express";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import {CurrentUser, identifierToDto} from "@app/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { UserDocument } from "@app/common";
import { UsersService } from "./users/users.service";
import { GetUserDto } from "./users/dto/get-user.dto";

@Controller("auth")
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
  @MessagePattern("authenticate")
  async authenticate(@Payload() payload: any) {
    console.log("PAYLOAD IN AUTHENTICATE: ", payload);
    return payload.user;
  }

  @Post("logout")
  async logout(
      @Req() request: Request,
      @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const cookies = (request as never).cookies as { [key: string]: string };

    if (cookies?.Authentication || request.headers?.authentication) {
      return await this.authService.logout(response);
    }

    return {
      message: "success",
    };
  }
}
