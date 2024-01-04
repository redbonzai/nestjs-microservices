import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      configService: ConfigService,
      private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // Correctly access the Authentication token from cookies or headers
          return (
              request?.cookies?.Authentication ||
              request?.headers.authentication // Headers are typically lowercase
          );
        },
      ]),
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate({ userId }: TokenPayload) {
    return this.usersService.getCurrentUser({ _id: userId });
  }
}
