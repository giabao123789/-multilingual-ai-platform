import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { AddMessageDto } from './dto/add-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  listChats(@CurrentUser() user: JwtPayload) {
    return this.chatsService.listChats(user.sub);
  }

  @Get(':id')
  getChat(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.chatsService.getChat(user.sub, id);
  }

  @Post()
  createChat(@CurrentUser() user: JwtPayload, @Body() createChatDto: CreateChatDto) {
    return this.chatsService.createChat(user.sub, createChatDto);
  }

  @Post(':id/messages')
  addMessage(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() addMessageDto: AddMessageDto,
  ) {
    return this.chatsService.addMessage(user.sub, id, addMessageDto);
  }
}
