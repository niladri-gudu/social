export interface FeedItem {
  id: string;
  content: string;

  createdAt: Date;

  author: {
    id: string;
    username: string;
    avatarUrl: string;
  };

  likesCount: number;
  commentsCount: number;
}

export interface FeedResponse {
  items: FeedItem[];
  nextCursor: string | null;
}
