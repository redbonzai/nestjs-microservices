import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument, AbstractRepository } from '@app/common';
import { PermissionDocument } from './models/permission.schema';
import mongoose, { Model } from 'mongoose';
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

  async findOrCreatePermission(
    permissionName: string,
  ): Promise<mongoose.Types.ObjectId> {
    let permissionId: mongoose.Types.ObjectId =
      await this.getPermissionIdByName(permissionName);

    if (!permissionId) {
      const permission: mongoose.Document = await this.permissionModel.create({
        name: permissionName,
      });
      permissionId = permission._id;
    }

    return permissionId;
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

  async addPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<RoleDocument> {
    const role = await this.roleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const permission: Permission =
      await this.permissionModel.findById(permissionId);
    console.log('PERMISSION: ', permission);

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`,
      );
    }

    // Convert ObjectId to string for comparison
    const permissionIdStr = permission._id.toString();

    // Check if permission already exists in the role
    if (!role.permissions.some((pid) => pid.toString() === permissionIdStr)) {
      role.permissions.push(permission._id); // Push the ObjectId
      return role.save();
    }
    throw new BadRequestException(`Permission already assigned to role`);
  }

  async syncPermissions(
    roleId: string,
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

  async firstOrCreatePermissions(
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
}
