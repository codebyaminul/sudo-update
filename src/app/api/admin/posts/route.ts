import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isCurrentUserAdmin } from "@/lib/auth-utils";
import { PostStatus } from "@prisma/client";

export async function GET() {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Root admin clearance required" },
        { status: 403 }
      );
    }

    const pendingPosts = await prisma.post.findMany({
      where: {
        status: PostStatus.PENDING,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: pendingPosts });
  } catch (error) {
    console.error("[API_ADMIN_POSTS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching moderation queue" },
      { status: 500 }
    );
  }
}
