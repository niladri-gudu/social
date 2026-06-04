export interface SocketUser {
  userId: string;
}

declare module "socket.io" {
  // augment the existing SocketData type instead of redeclaring Socket.data
  interface SocketData {
    user?: SocketUser;
  }
}
