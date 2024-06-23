// src/chat/chat.controller.ts
import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("send")
  async sendMessage(
    @Body()
    {
      senderId,
      recipientId,
      message,
    }: {
      senderId: string;
      recipientId: string;
      message: string;
    }
  ) {
    await this.chatService.processMessage({ senderId, recipientId, message });
    return { status: "Message sent" };
  }

  @Get("messages")
  getMessages(@Query("userId") userId: string) {
    const messages = this.chatService.getMessagesForUser(userId);
    return { messages };
  }
}
