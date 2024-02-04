import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { RolesModule } from './roles.module';

async function bootstrap() {
  const app = await NestFactory.create(RolesModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });
  console.log('ROLES SERVICE TCP PORT: ', configService.get('TCP_PORT'));
  console.log('auth service tcp port: ', configService.get('AUTH_PORT'));
  console.log('AUTH SERVICE AUTH_HOST: ', configService.get('AUTH_HOST'));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}

bootstrap().then(() =>
  console.log('Roles service is bootstrapped amd running'),
);
