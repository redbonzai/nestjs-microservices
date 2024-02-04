import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import {
  AUTH_SERVICE,
  ROLES,
  DatabaseModule,
  LoggerModule,
  ResponseInterceptor,
} from '@app/common';

import { PermissionsRepository } from './permissions.repository';
import { RoleDocument, RoleSchema } from '@roles/models/role.schema';
import {
  PermissionDocument,
  PermissionSchema,
} from './models/permission.schema';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: RoleDocument.name, schema: RoleSchema },
      { name: PermissionDocument.name, schema: PermissionSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        // AUTH_HOST: Joi.string().required(),
        // AUTH_PORT: Joi.number().required(),
        ROLES_HOST: Joi.string().required(),
        ROLES_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      // {
      //   name: AUTH_SERVICE,
      //   useFactory: (configService: ConfigService) => ({
      //     transport: Transport.TCP,
      //     options: {
      //       host: configService.get('AUTH_HOST'),
      //       port: configService.get('AUTH_PORT'),
      //     },
      //   }),
      //   inject: [ConfigService],
      // },
      {
        name: ROLES,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('ROLES_HOST'),
            port: configService.get('ROLES_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    PermissionsService,
    PermissionsRepository,
  ],
})
export class PermissionsModule {}
