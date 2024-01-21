import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  getHello(): string {
    return 'Hello World!';
  }
}
