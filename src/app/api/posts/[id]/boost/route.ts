import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required to boost signal" },
        { status: 401 }
      );
    }

    const { id: postId } = await params;

    const existingBoost = await prisma.boost.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    let hasBoosted = false;

    if (existingBoost) {
      await prisma.boost.delete({
        where: {
          id: existingBoost.id,
        },
      });
      hasBoosted = false;
    } else {
      await prisma.boost.create({
        data: {
          userId: user.id,
          postId,
        },
      });
      hasBoosted = true;
    }

    const totalBoosts = await prisma.boost.count({
      where: { postId },
    });

    try {
      (revalidateTag as any)("posts", "max");
    } catch {
      (revalidateTag as any)("posts");
    }
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      hasBoosted,
      totalBoosts,
      message: hasBoosted ? "Signal amplified" : "Signal recalled",
    });
  } catch (error) {
    console.error("[POST_BOOST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update signal boost" },
      { status: 500 }
    );
  }
}
