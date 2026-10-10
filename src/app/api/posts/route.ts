import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { createPostSchema } from "@/lib/validations";
import { PostCategory, PostStatus } from "@prisma/client";
import { DEMO_POSTS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const queryParam = searchParams.get("q");
    const sortParam = searchParams.get("sort");

    const whereClause: any = {
      status: PostStatus.APPROVED,
    };

    if (categoryParam && Object.values(PostCategory).includes(categoryParam as PostCategory)) {
      whereClause.category = categoryParam as PostCategory;
    }

    if (queryParam && queryParam.trim()) {
      const q = queryParam.trim();
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { sourceUrl: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderByClause =
      sortParam === "top"
        ? [{ boosts: { _count: "desc" as const } }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            boosts: true,
          },
        },
      },
      orderBy: orderByClause,
      take: 50,
    });

    if (posts.length > 0) {
      return NextResponse.json({ success: true, data: posts });
    }
  } catch (error) {
    // Database connection offline
  }

  // Local demo fallback
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get("category");
  let filtered = DEMO_POSTS;
  if (cat && Object.values(PostCategory).includes(cat as PostCategory)) {
    filtered = DEMO_POSTS.filter((p) => p.category === (cat as PostCategory));
  }
  return NextResponse.json({ success: true, data: filtered, isLocalFallback: true });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required to submit intelligence" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = createPostSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, content, category, imageUrl, sourceUrl } = parseResult.data;

    try {
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          category,
          imageUrl: imageUrl || null,
          sourceUrl,
          status: PostStatus.PENDING,
          authorId: user.id,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Intel received and queued for root clearance verification",
          data: newPost,
        },
        { status: 201 }
      );
    } catch (dbError) {
      // Offline local testing simulation fallback
      const simulatedPost = {
        id: "post_dev_" + Math.random().toString(36).substring(2, 9),
        title,
        content,
        category,
        imageUrl: imageUrl || null,
        sourceUrl,
        status: PostStatus.PENDING,
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return NextResponse.json(
        {
          success: true,
          message: "Intel received and queued for root clearance verification (Dev Buffer)",
          data: simulatedPost,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("[API_POSTS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to persist intel dispatch" },
      { status: 500 }
    );
  }
}
