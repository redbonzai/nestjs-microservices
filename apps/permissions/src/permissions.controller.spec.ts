import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './permissions.repository';

describe('PermissionsController', () => {
  let permissionsController: PermissionsController;
  let permissionsRepo: PermissionsRepository;

  beforeEach(async () => {
    const mockPermissionDocumentModel = {};
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        PermissionsService,
        PermissionsRepository,
        {
          provide: 'PermissionDocumentModel',
          useValue: mockPermissionDocumentModel, // Provide a suitable mock value here
        },
      ],
    }).compile();

    permissionsController = app.get<PermissionsController>(
      PermissionsController,
    );
    permissionsRepo = app.get<PermissionsRepository>(PermissionsRepository);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      spyOn(permissionsRepo, 'create').and.returnValue({ permissions: [] });
      spyOn(permissionsController, 'findAll').and.returnValue({
        permissions: [
          {
            _id: '123',
            name: 'test',
            description: 'test',
          },
          {
            _id: '1234',
            name: 'test2',
            description: 'test2',
          },
        ],
      });

      expect(permissionsController.findAll()).toBe({
        permissions: [
          {
            _id: '123',
            name: 'test',
            description: 'test',
          },
          {
            _id: '1234',
            name: 'test2',
            description: 'test2',
          },
        ],
      });
    });
  });
});
