import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { PaymentsModule } from './payments.module';
import { validateEnvVariables } from '@app/common/validators';
import * as Joi from 'joi';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('PORT'),
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();

  validateEnvVariables(
    Joi.object({
      PORT: Joi.number().required(),
      NOTIFICATIONS_HOST: Joi.string().required(),
      NOTIFICATIONS_PORT: Joi.number().required(),
      STRIPE_SECRET_KEY: Joi.string().required(),
    }),
  );
}
bootstrap().then(() =>
  console.info('payment service is bootstrapped and running'),
);
