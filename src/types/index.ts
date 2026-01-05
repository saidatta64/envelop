export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    username: string;
    _id: string;
  } | string;
  createdAt: string;
  style?: {
    backgroundColor?: string;
    fontFamily?: string;
    textColor?: string;
  };
}

export interface Session {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}
