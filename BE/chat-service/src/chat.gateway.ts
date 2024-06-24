import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

interface ConnectedUser {
  socket: Socket;
  userId: string;
}

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private connectedUsers: ConnectedUser[] = [];

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.socket.id !== client.id
    );
  }

  @SubscribeMessage("register")
  handleRegister(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket
  ) {
    this.connectedUsers.push({ socket: client, userId });
    console.log(`User registered: ${userId}`);

    const messages = this.chatService.getMessagesForUser(userId);
    client.emit("message_history", messages);
  }

  @SubscribeMessage("message")
  async handleMessage(
    @MessageBody()
    {
      senderId,
      recipientId,
      message,
    }: { senderId: string; recipientId: string; message: string },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const recipient = this.connectedUsers.find(
      (user) => user.userId === recipientId
    );
    if (recipient) {
      recipient.socket.emit("message", { senderId, message });
    }
    await this.chatService.processMessage({ senderId, recipientId, message });
  }
}
