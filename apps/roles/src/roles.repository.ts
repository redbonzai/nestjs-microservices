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
    const roles = await this.firstOrCreateRoleNames(roleNames);

    if (roles.length !== roleNames.length) {
      throw new NotFoundException('One or more roles not found');
    }

    return roles.map((role: Role) => role._id);
  }

  async findByIdAndPopulatePermissions(
    roleId: Types.ObjectId,
  ): Promise<RoleDocument | null> {
    const role = await this.roleModel.findById(roleId).populate({
      path: 'permissions',
      select: 'name -_id',
    });
    console.log('Role:', role);
    return role;
  }

  // async firstOrCreateRoles(roles: CreateRoleDto[]): Promise<Role[]> {
  //   return Promise.all(
  //     roles.map(async (role) => {
  //       return this.roleModel.findOneAndUpdate(
  //         { role },
  //         { $setOnInsert: { role } },
  //         { new: true, upsert: true },
  //       );
  //     }),
  //   );
  // }

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
