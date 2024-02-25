import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '@roles/dto';
import { RolesRepository } from './roles.repository';
import { AbstractDocument } from '@app/common';
import { PermissionsRepository } from '@permissions/permissions.repository';
import { RoleDocument } from '@roles/models';
import { Permission } from '@permissions/interfaces';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepository: RolesRepository,
    private readonly permissionRepository: PermissionsRepository,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    let permissionIds = [];

    // If there are permissions specified, find or create them
    if (createRoleDto.permissions && createRoleDto.permissions.length > 0) {
      const permissions: Permission[] =
        await this.permissionRepository.firstOrCreate(
          createRoleDto.permissions.map((name: string) => ({ name })),
        );

      permissionIds = permissions.map(
        (permission: Permission) => permission._id,
      );
    }

    // Create the role with or without permissions
    const role: AbstractDocument = await this.roleRepository.create({
      ...createRoleDto,
      permissions: permissionIds, // This can be an empty array if no permissions were provided
    });

    console.log('RECENTLY CREATED ROLE : ', role);

    return await this.roleRepository.findByIdAndPopulatePermissions(role._id);
  }

  findAll(): Promise<AbstractDocument[]> {
    return this.roleRepository.find({});
  }

  findOne(_id: string): Promise<AbstractDocument> {
    return this.roleRepository.findOne({ _id });
  }

  update(id: string, updateRoleDto: UpdateRoleDto): Promise<AbstractDocument> {
    return this.roleRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateRoleDto },
    );
  }

  async remove(id: string): Promise<AbstractDocument> {
    return await this.roleRepository.findOneAndDelete({ _id: id });
  }

  async firstOrCreateRoles(roleData: CreateRoleDto[]): Promise<RoleDocument[]> {
    return this.roleRepository.firstOrCreateRoles(roleData);
  }
}
