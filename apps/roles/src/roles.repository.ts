import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument, AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { RoleDocument } from '@roles/models';
import { PermissionDocument } from '@permissions/models/permission.schema';
import { Role } from '@roles/interfaces';
import { CreateRoleDto } from '@roles/dto';

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

  async getRoleIdsFromRoleNames(
    roleNames: string[],
  ): Promise<mongoose.Types.ObjectId[]> {
    const roleIds = await this.upsertRoles(roleNames);
    if (roleIds.length !== roleNames.length) {
      throw new NotFoundException('One or more roles not found');
    }

    return roleIds;
  }

  // async getRoleIdsFromRoleNames(
  //   roleNames: string[],
  // ): Promise<Types.ObjectId[]> {
  //   const roles = await this.upsertRoles(roleNames);
  //   if (roles.length !== roleNames.length) {
  //     throw new NotFoundException('One or more roles not found');
  //   }
  //
  //   return roles;
  // }

  async upsertRoles(names: string[]): Promise<Types.ObjectId[]> {
    for (const name of names) {
      const existingRole = await this.roleModel.findOne({ name }).exec();

      if (existingRole) {
        await this.roleModel.create({ name });
      }
    }
    const roles = await this.firstOrCreateRoleNames(names);
    console.log('ROLES TO RETURN: ', roles);
    return roles.map((role: Role) => role._id);
  }

  async firstOrCreateRoles(roles: CreateRoleDto[]): Promise<RoleDocument[]> {
    return Promise.all(
      roles.map(async (roleData) => {
        const { name, ...updateData } = roleData; // Deconstruct to separate name from the rest
        return this.roleModel
          .findOneAndUpdate(
            { name }, // Match by name
            { $setOnInsert: updateData }, // Set all other fields on insert
            { new: true, upsert: true }, // Return new document if one is upserted
          )
          .exec(); // Ensure exec is called to execute the query
      }),
    );
  }

  async findByIdAndPopulatePermissions(
    roleId: Types.ObjectId,
  ): Promise<RoleDocument | null> {
    return this.roleModel.findById(roleId).populate({
      path: 'permissions',
      select: 'name -_id',
    });
  }

  async firstOrCreateRoleNames(roleNames: string[]): Promise<Role[]> {
    return Promise.all(
      roleNames.map(async (name) => {
        return this.roleModel.findOneAndUpdate(
          { name },
          { $setOnInsert: { name } },
          { new: true, upsert: true },
        );
      }),
    );
  }
}
