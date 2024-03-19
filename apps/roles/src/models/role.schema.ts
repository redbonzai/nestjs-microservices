import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class RoleDocument extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop([{ type: Types.ObjectId, ref: 'Permission' }])
  permissions: Types.ObjectId[];

  // @Prop( type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }])
  // permissions: mongoose.Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(RoleDocument);
