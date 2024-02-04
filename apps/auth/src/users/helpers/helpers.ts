// Helper method to fetch role ObjectId's from role names
import mongoose from 'mongoose';
import { RolesRepository } from '@roles/roles.repository';
import { RoleDocument } from '@roles/models/role.schema';
import { NotFoundException } from '@nestjs/common';

export async function getRoleIdsFromRoleNames(
  rolesRepository: RolesRepository,
  roleNames: string[],
): Promise<mongoose.Types.ObjectId[]> {
  const roles = await rolesRepository.find({
    name: { $in: roleNames },
  });

  if (roles.length !== roleNames.length) {
    throw new NotFoundException('One or more roles not found');
  }

  return roles.map((role: RoleDocument) => role._id);
}
