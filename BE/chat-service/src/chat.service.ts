import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy, EventPattern } from "@nestjs/microservices";

export interface Message {
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  private messages: Message[] = [];

  constructor(
    @Inject("MESSAGE_SERVICE") private readonly client: ClientProxy
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async processMessage(message: Omit<Message, "timestamp">) {
    const newMessage = { ...message, timestamp: new Date() };
    this.messages.push(newMessage);
    this.client.emit("messages_queue", newMessage);
  }

  getMessagesForUser(userId: string): Message[] {
    return this.messages.filter(
      (message) => message.senderId === userId || message.recipientId === userId
    );
  }

  @EventPattern("messages_queue")
  async handleMessage(data: Message) {
    this.messages.push(data);
  }
}
