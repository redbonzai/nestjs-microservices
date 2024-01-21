import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

describe('PermissionsController', () => {
  let permissionsController: PermissionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [PermissionsService],
    }).compile();

    permissionsController = app.get<PermissionsController>(PermissionsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(permissionsController.getHello()).toBe('Hello World!');
    });
  });
});
