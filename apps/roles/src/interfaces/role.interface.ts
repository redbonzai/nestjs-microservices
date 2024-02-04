import mongoose from 'mongoose';
import { Permission } from '@permissions/interfaces';

// @ts-ignore
export interface Role extends mongoose.Document {
  _id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
}
