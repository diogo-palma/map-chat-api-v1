import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  roles: string[];

  @Prop({ default: "ACTIVE" })
  active: "ACTIVE" | "INACTIVATE";
}

export const UserSchema = SchemaFactory.createForClass(User);