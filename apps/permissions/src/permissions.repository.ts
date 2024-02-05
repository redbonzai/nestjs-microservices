import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument, AbstractRepository } from '@app/common';
import { PermissionDocument } from './models/permission.schema';
import mongoose, { Model, Types } from 'mongoose';
import { RoleDocument } from '@roles/models/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from '@permissions/interfaces';

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

  async getPermissionIdByName(
    permissionName: string,
  ): Promise<mongoose.Types.ObjectId | null> {
    const permission = await this.permissionModel
      .findOne({ permissionName })
      .exec();
    return permission ? permission._id : null;
  }

  async getPermissionIDsByNames(
    permissionNames: string[],
  ): Promise<mongoose.Types.ObjectId[]> {
    const permissionIds: mongoose.Types.ObjectId[] = await Promise.all(
      permissionNames.map(async (name) => this.getPermissionIdByName(name)),
    );
    return permissionIds.filter(
      (id): id is mongoose.Types.ObjectId => id !== null,
    );
  }

  async upsertPermissions(names: string[]): Promise<void> {
    // Iterate over each name and upsert the permission.
    for (const name of names) {
      const existingPermission = await this.permissionModel
        .findOne({ name })
        .exec();

      // If the permission does not exist, create it.
      if (!existingPermission) {
        await this.permissionModel.create({ name });
      }
    }
  }

  async firstOrCreate(
    permissionsData: Array<{ name: string; description?: string }>,
  ): Promise<Permission[]> {
    return Promise.all(
      permissionsData.map(async (permissionData) => {
        const { name, description } = permissionData;
        return this.permissionModel.findOneAndUpdate(
          { name },
          { $setOnInsert: { name, description } },
          { new: true, upsert: true },
        );
      }),
    );
  }

  async addPermissionsToRole(
    roleId: Types.ObjectId,
    permissionIds: Types.ObjectId[],
  ): Promise<RoleDocument> {
    const role = await this.roleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const permissions: PermissionDocument[] =
      // await this.permissionModel.findById(permissionIds);    const permission: Permission =
      await this.permissionModel.find({ _id: { $in: permissionIds } });
    console.log('PERMISSION: ', permissions);

    if (!permissions.length) {
      throw new NotFoundException(
        `Permissions not found`,
      );
    }

    // Filter out permissions that are already part of the role
    const newPermissions = permissions.filter(
      (permission) =>
        !role.permissions.some((rolePermId) => rolePermId.equals(permission._id),
        ),
    );

    if (newPermissions.length) {
      // Add new permissions to the role
      role.permissions.push(
        ...newPermissions.map((permission) => permission._id),
      );
      await role.save();
      return role;
    }
    throw new BadRequestException(`Permission already assigned to role`);
  }

  async syncPermissions(
    roleId: Types.ObjectId,
    permissionNames: string[],
  ): Promise<RoleDocument> {
    const role: RoleDocument = await this.roleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Find permissions by names
    const permissions: Permission[] = await this.permissionModel.find({
      name: { $in: permissionNames },
    });

    // Set role's permissions
    role.permissions = permissions.map(
      (permission: Permission) => permission._id,
    );
    return role;
  }
}
