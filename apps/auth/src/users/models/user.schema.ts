import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common/database/abstract.schema';

@Schema({ versionKey: 'version', timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema =
  SchemaFactory.createForClass(UserDocument);
