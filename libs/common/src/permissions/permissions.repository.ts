import { Injectable, Logger } from '@nestjs/common';
import { AbstractDocument, AbstractRepository } from '@app/common';
import { PermissionDocument } from '@app/common/permissions/models/guards/permission.schema';
import { Model } from 'mongoose';
import { RoleDocument } from '@app/common/roles/models/role.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PermissionsRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(PermissionsRepository.name);
  private permissionModel: Model<PermissionDocument>;
  private roleModel: Model<RoleDocument>;

  constructor(
    @InjectModel(PermissionDocument.name)
    permissionModel: Model<PermissionDocument>,
    @InjectModel(RoleDocument.name)
    roleModel: Model<RoleDocument>,
  ) {
    super(permissionModel);
    this.permissionModel = permissionModel;
    this.roleModel = roleModel;
  }
}
