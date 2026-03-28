import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ChatRole = 'user' | 'assistant';
export type ChatDocument = HydratedDocument<Chat>;

@Schema({
  _id: false,
  versionKey: false,
})
export class ChatMessage {
  @Prop({
    required: true,
    enum: ['user', 'assistant'],
  })
  role: ChatRole;

  @Prop({
    required: true,
    trim: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  createdAt: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Chat {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 120,
  })
  title: string;

  @Prop({
    type: [ChatMessageSchema],
    default: [],
  })
  messages: ChatMessage[];

  createdAt: Date;
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.index({ userId: 1, updatedAt: -1 });
