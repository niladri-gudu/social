export type ID = string;

export type PublicUser = {
  id: ID;
  name: string;
  username: string;
  imageUrl: string | null;
  createdAt: Date;
};

export type NotificationKind = "LIKE" | "COMMENT" | "FOLLOW";

export type NotificationPayload = {
  id: ID;
  recipientId: ID;
  actorId: ID;
  type: NotificationKind;
  entityId?: ID;
  createdAt: Date;
};

export type ActivityKind = "POST_CREATED" | "POST_LIKED" | "COMMENT_CREATED" | "USER_FOLLOWED";
