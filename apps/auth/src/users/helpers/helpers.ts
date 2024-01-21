// Helper method to fetch role ObjectId's from role names
import mongoose from 'mongoose';
import { RolesRepository } from '@app/common/roles/roles.repository';
import { RoleDocument } from '@app/common/roles/models/role.schema';

export async function getRoleIdsFromNames(
  rolesRepository: RolesRepository,
  roleNames: string[],
): Promise<mongoose.Types.ObjectId[]> {
  const roles = await rolesRepository.find({
    name: { $in: roleNames },
  });

  return roles.map((role: RoleDocument) => role._id);
}
