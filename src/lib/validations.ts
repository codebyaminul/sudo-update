import { z } from "zod";
import { PostCategory, PostStatus } from "@prisma/client";

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters")
    .max(160, "Title cannot exceed 160 characters"),
  content: z
    .string()
    .trim()
    .min(10, "Content briefing must contain at least 10 characters")
    .max(5000, "Content briefing cannot exceed 5000 characters"),
  category: z.nativeEnum(PostCategory, {
    message: "Select a valid intelligence category",
  }),
  imageUrl: z
    .string()
    .trim()
    .url("Image must be a valid URL (http/https)")
    .optional()
    .or(z.literal("")),
  sourceUrl: z
    .string()
    .trim()
    .url("Source reference must be a valid URL (http/https)"),
});

export const moderatePostSchema = z.object({
  status: z.nativeEnum(PostStatus, {
    message: "Valid status required (PENDING, APPROVED, REJECTED)",
  }),
  title: z.string().trim().min(3).max(160).optional(),
  content: z.string().trim().min(10).max(5000).optional(),
  category: z.nativeEnum(PostCategory).optional(),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Field note cannot be empty")
    .max(1500, "Field note cannot exceed 1500 characters"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type ModeratePostInput = z.infer<typeof moderatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

