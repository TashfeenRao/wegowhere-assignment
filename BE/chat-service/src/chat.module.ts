import { Module, OnModuleInit } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MESSAGE_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
          queue: "messages_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule implements OnModuleInit {
  async onModuleInit() {
    console.log("Connecting to RabbitMQ...");
  }
}
