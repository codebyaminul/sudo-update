import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { commentId } = await context.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment log not found" },
        { status: 404 }
      );
    }

    // Only author or admin can delete
    if (comment.authorId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Insufficient clearance to purge this record" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      success: true,
      message: "Comment log successfully purged",
    });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error purging comment" },
      { status: 500 }
    );
  }
}
