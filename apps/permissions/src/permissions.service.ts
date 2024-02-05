import { Injectable } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { AbstractDocument } from '@app/common';
import { PermissionsRepository } from './permissions.repository';
import mongoose, { Types } from 'mongoose';
import { RoleDocument } from '@roles/models';
import { Permission } from '@permissions/interfaces';
// import { AddPermissionsDto } from '@permissions/dto/add-permissions.dto';
import { RolesRepository } from '@roles/roles.repository';
import { AddPermissionsDto } from '@permissions/dto/add-permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly permissionRepository: PermissionsRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}
  create(createPermissionDto: CreatePermissionDto): Promise<AbstractDocument> {
    return this.permissionRepository.create(createPermissionDto);
  }

  async upsertPermissions(permissionNames: string[]): Promise<void> {
    return this.permissionRepository.upsertPermissions(permissionNames);
  }
  async update(
    id: string,
    updateRoleDto: UpdatePermissionDto,
  ): Promise<AbstractDocument> {
    return this.permissionRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateRoleDto },
    );
  }

  findAll(): Promise<AbstractDocument[]> {
    return this.permissionRepository.find({});
  }

  findOne(_id: string): Promise<AbstractDocument> {
    return this.permissionRepository.findOne({ _id });
  }

  async remove(id: string): Promise<AbstractDocument> {
    return await this.permissionRepository.findOneAndDelete({ _id: id });
  }

  async getPermissionIdByName(
    permissionName: string,
  ): Promise<mongoose.Types.ObjectId | null> {
    return await this.permissionRepository.getPermissionIdByName(
      permissionName,
    );
  }
  async addPermissionsToRole(
    roleId: Types.ObjectId,
    addPermissionsDto: AddPermissionsDto,
  ): Promise<RoleDocument> {
    // Extract structured permissions data from DTO
    const permissionsData = addPermissionsDto.permissions;

    // Process permissions: find existing or create new
    const permissionsDocs =
      await this.permissionRepository.firstOrCreate(permissionsData);

    // Update role with permissions' ObjectIds
    return this.permissionRepository.addPermissionsToRole(
      roleId,
      permissionsDocs.map((permission) => permission._id),
    );
  }

  async syncPermissions(
    roleId: Types.ObjectId,
    permissionNames: string[],
  ): Promise<RoleDocument> {
    return await this.permissionRepository.syncPermissions(
      roleId,
      permissionNames,
    );
  }

  async firstOrCreatePermissions(
    permissionData: CreatePermissionDto[],
  ): Promise<Permission[]> {
    return await this.permissionRepository.firstOrCreate(permissionData);
  }
}
