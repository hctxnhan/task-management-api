import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';

import { Notification } from '@/entities/notification.entity';
import { WebSocketServer } from '@nestjs/websockets/decorators';
import { Cache } from 'cache-manager';
import { Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  namespace: 'notifications',
})
export class NotificationGateway implements OnGatewayConnection {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  private readonly server: Server;

  async handleConnection(client: any, ...args: any[]) {
    const { token } = client.handshake.query;
    const user = await this.authService.validateToken(token);
    if (user) {
      this.cacheManager.set(user.id.toString(), client.id, 0);
    } else {
      client.disconnect();
    }
  }

  async emitNotificationToUser(userId: number, data: Notification) {
    const clientId = await this.cacheManager.get<string>(userId.toString());
    if (clientId) {
      this.server.to(clientId).emit('notification', data);
    }
  }
}
