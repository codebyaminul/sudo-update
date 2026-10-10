import { Post as PrismaPost, PostCategory, PostStatus, User as PrismaUser } from "@prisma/client";

export { PostCategory, PostStatus };

export type PostWithAuthor = PrismaPost & {
  author: Pick<PrismaUser, "id" | "name" | "email" | "image">;
  _count?: {
    boosts: number;
  };
  hasBoosted?: boolean;
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
