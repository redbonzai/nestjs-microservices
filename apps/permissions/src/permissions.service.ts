import { Injectable } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { AbstractDocument } from '@app/common';
import { PermissionsRepository } from './permissions.repository';
import mongoose from 'mongoose';
import { RoleDocument } from '@roles/models';
import { Permission } from '@permissions/interfaces';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionsRepository) {}
  create(createPermissionDto: CreatePermissionDto): Promise<AbstractDocument> {
    return this.permissionRepository.create(createPermissionDto);
  }

  findAll(): Promise<AbstractDocument[]> {
    return this.permissionRepository.find({});
  }

  findOne(_id: string): Promise<AbstractDocument> {
    return this.permissionRepository.findOne({ _id });
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

  async addPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<RoleDocument> {
    return await this.permissionRepository.addPermissionToRole(
      roleId,
      permissionId,
    );
  }

  async syncPermissions(
    roleId: string,
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
    return await this.permissionRepository.firstOrCreatePermissions(
      permissionData,
    );
  }
}
