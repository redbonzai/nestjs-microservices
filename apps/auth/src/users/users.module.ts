import { Module } from '@nestjs/common';
import { DatabaseModule, ResponseInterceptor } from '@app/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDocument, UserSchema } from '@app/common';
import { UsersRepository } from './users.repository';
// import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResponseInterceptor,
    // },
    UsersService,
    UsersRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
