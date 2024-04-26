import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  users: number = 0;

  async handleConnection() {
    // A client has connected
    this.users++;

    // Notify connected clients of current users
    // this.server.emit('users', this.users);
  }

  async handleDisconnect() {
    // A client has disconnected
    this.users--;

    // Notify connected clients of current users
    // this.server.emit('users', this.users);
  }

  @SubscribeMessage('notification')
  async onNotification(client, message) {
    client.broadcast.emit('notification', message);
  }

  @SubscribeMessage('chatAccountById')
  async onAccountById(client, { id, message }) {
    client.to(id).emit('chatAccountById', message);
  }
}