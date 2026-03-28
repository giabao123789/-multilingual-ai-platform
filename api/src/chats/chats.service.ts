import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AiService } from '../ai/ai.service';
import { AddMessageDto } from './dto/add-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat, ChatDocument, ChatRole } from './schemas/chat.schema';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    private readonly aiService: AiService,
  ) {}

  async listChats(userId: string) {
    const chats = await this.chatModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .exec();

    return chats.map((chat) => {
      const lastMessage = chat.messages.at(-1);

      return {
        id: chat.id,
        title: chat.title,
        lastMessagePreview: lastMessage
          ? this.truncate(lastMessage.content, 120)
          : '',
        messageCount: chat.messages.length,
        updatedAt: chat.updatedAt.toISOString(),
      };
    });
  }

  async getChat(userId: string, chatId: string) {
    const chat = await this.findOwnedChat(userId, chatId);
    return this.serializeChat(chat);
  }

  async createChat(userId: string, createChatDto: CreateChatDto) {
    const userMessage = this.createMessage('user', createChatDto.message);
    const assistantReply = await this.aiService.generateReply({
      locale: createChatDto.locale,
      history: [],
      message: createChatDto.message,
    });
    const assistantMessage = this.createMessage('assistant', assistantReply);

    const chat = await this.chatModel.create({
      userId,
      title: this.deriveTitle(createChatDto.message),
      messages: [userMessage, assistantMessage],
    });

    return this.serializeChat(chat);
  }

  async addMessage(userId: string, chatId: string, addMessageDto: AddMessageDto) {
    const chat = await this.findOwnedChat(userId, chatId);
    const userMessage = this.createMessage('user', addMessageDto.message);

    const assistantReply = await this.aiService.generateReply({
      locale: addMessageDto.locale,
      history: chat.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      message: addMessageDto.message,
    });

    const assistantMessage = this.createMessage('assistant', assistantReply);

    chat.messages.push(userMessage, assistantMessage);
    await chat.save();

    return this.serializeChat(chat);
  }

  private async findOwnedChat(userId: string, chatId: string) {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException('Invalid chat id.');
    }

    const chat = await this.chatModel.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      throw new NotFoundException('Chat not found.');
    }

    return chat;
  }

  private createMessage(role: ChatRole, content: string) {
    return {
      role,
      content,
      createdAt: new Date(),
    };
  }

  private deriveTitle(message: string) {
    return this.truncate(
      message
        .replace(/\s+/g, ' ')
        .trim(),
      60,
    );
  }

  private truncate(value: string, length: number) {
    if (value.length <= length) {
      return value;
    }

    return `${value.slice(0, length - 1)}…`;
  }

  private serializeChat(chat: ChatDocument) {
    return {
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages.map((message) => ({
        role: message.role,
        content: message.content,
        createdAt: new Date(message.createdAt).toISOString(),
      })),
    };
  }
}
