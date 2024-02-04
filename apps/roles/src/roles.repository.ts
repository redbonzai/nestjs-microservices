import { Injectable, Logger } from '@nestjs/common';
import { AbstractDocument, AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoleDocument } from './models/role.schema';
import { PermissionDocument } from '@permissions/models/permission.schema';
import { Role } from '@roles/interfaces';

@Injectable()
export class RolesRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(RolesRepository.name);
  private roleModel: Model<RoleDocument>;
  private permissionModel: Model<PermissionDocument>;

  constructor(
    @InjectModel(RoleDocument.name)
    roleModel: Model<RoleDocument>,
    @InjectModel(PermissionDocument.name)
    permissionModel: Model<PermissionDocument>,
  ) {
    super(roleModel);
    this.roleModel = roleModel;
    this.permissionModel = permissionModel;
  }

  async findByIdAndPopulatePermissions(roleId: Types.ObjectId): Promise<RoleDocument | null> {
    const role = await this.roleModel.findById(roleId)
      .populate({
        path: 'permissions',
        select: 'name -_id'
      });
    console.log('Role:', role);
    return role;
    // .exec(); // You can omit .exec() if using async/await
  }

  async firstOrCreateRoles(
    rolesData: Array<{ name: string; description?: string }>,
  ): Promise<Role[]> {
    return Promise.all(
      rolesData.map(async (roleData) => {
        const { name, description } = roleData;
        return this.roleModel.findOneAndUpdate(
          { name },
          { $setOnInsert: { name, description } },
          { new: true, upsert: true },
        );
      }),
    );
  }
}
