import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PaymentsService } from "./payments.service";
import { PaymentsCreateChargeDto } from "./dto";

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern("create_charge")
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    return await this.paymentsService.createCharge(data);
  }
}
