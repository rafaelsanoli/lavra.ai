import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // TODO: Configure proper CORS in production
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private connectedUsers = new Map<string, string>(); // socketId -> userId

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Extract userId from handshake auth
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId;
    
    if (userId) {
      this.connectedUsers.set(client.id, userId as string);
      client.join(`user:${userId}`);
      this.logger.log(`User ${userId} joined room`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    this.logger.log(`Client disconnected: ${client.id}${userId ? ` (User: ${userId})` : ''}`);
    
    if (userId) {
      this.connectedUsers.delete(client.id);
    }
  }

  // Generic emit to specific user
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
    this.logger.debug(`Emitted ${event} to user ${userId}`);
  }

  // Generic emit to all connected clients
  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.debug(`Emitted ${event} to all clients`);
  }

  // Emit to specific room
  emitToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
    this.logger.debug(`Emitted ${event} to room ${room}`);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Check if user is connected
  isUserConnected(userId: string): boolean {
    return Array.from(this.connectedUsers.values()).includes(userId);
  }
}
