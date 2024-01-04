import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ReservationsModule } from './reservations.module';
import { validateEnvVariables } from '@app/common/validators';
import * as Joi from 'joi';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));

  validateEnvVariables(
    Joi.object({
      MONGODB_URI: Joi.string().required(),
      PORT: Joi.number().required(),
      AUTH_HOST: Joi.string().required(),
      PAYMENTS_HOST: Joi.string().required(),
      AUTH_PORT: Joi.number().required(),
      PAYMENTS_PORT: Joi.number().required(),
    }),
  );
}
bootstrap().then(() =>
  console.log('Reservation service is bootstrapped and running'),
);
