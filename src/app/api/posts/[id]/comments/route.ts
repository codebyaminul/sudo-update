import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { createCommentSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isAdmin: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch intel transmissions" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to transmit intel log" },
        { status: 401 }
      );
    }

    const { id: postId } = await context.params;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, status: true },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Dispatch packet not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = createCommentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: parsed.data.content,
        postId,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isAdmin: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to post comment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error transmitting field note" },
      { status: 500 }
    );
  }
}
