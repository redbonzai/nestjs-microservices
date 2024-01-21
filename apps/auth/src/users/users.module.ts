import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDocument, UserSchema } from '@app/common';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from '@app/common/roles/roles.module';
import { RoleDocument, RoleSchema } from '@app/common/roles/models/role.schema';
import { RolesRepository } from '@app/common/roles/roles.repository';
import {
  PermissionDocument,
  PermissionSchema,
} from '@app/common/permissions/models/guards/permission.schema';
import { PermissionsRepository } from '@app/common/permissions/permissions.repository';

@Module({
  imports: [
    RolesModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: RoleDocument.name, schema: RoleSchema },
      { name: PermissionDocument.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    RolesRepository,
    PermissionsRepository,
  ],
  exports: [
    UsersService,
    MongooseModule,
    RolesRepository,
    PermissionsRepository,
  ],
})
export class UsersModule {}
