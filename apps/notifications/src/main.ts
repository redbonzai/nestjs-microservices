import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { NotificationsModule } from './notifications.module';
import { validateEnvVariables } from '@app/common/validators';
import * as Joi from 'joi';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
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
      GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
      GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
      GOOGLE_OAUTH_REFRESH_TOKEN: Joi.string().required(),
      SMTP_USER: Joi.string().required(),
    }),
  );
}
bootstrap().then(() =>
  console.log('Notification service is bootstrapped amd running'),
);
