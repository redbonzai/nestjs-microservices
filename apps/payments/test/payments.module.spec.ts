/**
 * Unit Tests for PaymentsModule
 */

import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import * as Joi from "joi";
import { PaymentsController } from "../src/payments.controller";
import { PaymentsService } from "../src/payments.service";

describe("PaymentsModule", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: Joi.object({
            PORT: Joi.number().required(),
            NOTIFICATIONS_HOST: Joi.string().required(),
            NOTIFICATIONS_PORT: Joi.number().required(),
            STRIPE_SECRET_KEY: Joi.string().required(),
          }),
        }),
        ClientsModule.registerAsync([
          {
            name: "NOTIFICATIONS_SERVICE",
            useFactory: (configService: ConfigService) => ({
              transport: Transport.TCP,
              options: {
                host: configService.get("NOTIFICATIONS_HOST"),
                port: configService.get("NOTIFICATIONS_PORT"),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      controllers: [PaymentsController],
      providers: [PaymentsService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  it("should have a valid configuration", () => {
    const configService = app.get(ConfigService);
    expect(configService.get("PORT")).toBeDefined();
    expect(configService.get("NOTIFICATIONS_HOST")).toBeDefined();
    expect(configService.get("NOTIFICATIONS_PORT")).toBeDefined();
    expect(configService.get("STRIPE_SECRET_KEY")).toBeDefined();
  });

  it("should register the PaymentsController", () => {
    const paymentsController = app.get(PaymentsController);
    expect(paymentsController).toBeDefined();
  });

  it("should register the PaymentsService", () => {
    const paymentsService = app.get(PaymentsService);
    expect(paymentsService).toBeDefined();
  });
});
