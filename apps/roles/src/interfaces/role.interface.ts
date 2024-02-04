import mongoose from 'mongoose';
import { Permission } from '@permissions/interfaces';

export interface Role extends mongoose.Document {
  name: string;
  description?: string;
  permissions: Permission[];
}
