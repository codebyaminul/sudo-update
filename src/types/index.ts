import { Post as PrismaPost, PostCategory, PostStatus, User as PrismaUser, Comment as PrismaComment } from "@prisma/client";

export { PostCategory, PostStatus };

export type CommentWithAuthor = PrismaComment & {
  author: Pick<PrismaUser, "id" | "name" | "email" | "image"> & {
    isAdmin?: boolean;
  };
};

export type PostWithAuthor = PrismaPost & {
  author: Pick<PrismaUser, "id" | "name" | "email" | "image"> & {
    isAdmin?: boolean;
  };
  _count?: {
    boosts: number;
    comments?: number;
  };
  hasBoosted?: boolean;
  comments?: CommentWithAuthor[];
};

export interface PostSubmissionPayload {
  title: string;
  content: string;
  category: PostCategory;
  imageUrl?: string;
  sourceUrl: string;
}

export interface PostModerationPayload {
  status: PostStatus;
  title?: string;
  content?: string;
  category?: PostCategory;
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  TECH: "TECH",
  AI: "AI",
  ESPORTS: "ESPORTS",
  CINEMA: "CINEMA",
  SPORTS: "SPORTS",
  GLOBAL_NEWS: "GLOBAL NEWS",
};
