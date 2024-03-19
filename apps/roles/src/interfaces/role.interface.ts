import mongoose from 'mongoose';
import { Permission } from '@permissions/interfaces';
import { Types } from 'mongoose';

// @ts-ignore
export interface Role extends mongoose.Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  permissions?: Permission[];
}
