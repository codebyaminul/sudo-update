import React from "react";
import prisma from "@/lib/prisma";
import { isCurrentUserAdmin, getCurrentUser } from "@/lib/auth-utils";
import ModerationTable from "@/components/admin/ModerationTable";
import { PostStatus } from "@prisma/client";
import { ShieldAlert, Terminal } from "lucide-react";
import Link from "next/link";
import { PostWithAuthor } from "@/types";
import { DEMO_PENDING_POSTS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAdmin = await isCurrentUserAdmin();
  const user = await getCurrentUser();

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 sm:p-8 border border-[#ff5555] bg-[#120a0d] font-mono text-center space-y-4">
        <div className="w-12 h-12 mx-auto border border-[#ff5555] bg-[#ff5555]/10 flex items-center justify-center text-[#ff5555]">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h1 className="text-lg font-bold text-[#ff5555] tracking-wide">
          [ 403_ACCESS_DENIED: ROOT_PRIVILEGES_REQUIRED ]
        </h1>

        <p className="text-xs text-[#9ca3af] leading-relaxed">
          {user ? (
            <>
              Operator identity <span className="text-[#e5e7eb]">@{user.email}</span> is not registered in the root authorization whitelist (`ADMIN_EMAIL`).
            </>
          ) : (
            <>Anonymous session detected. Root command & control requires active credentials.</>
          )}
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-3 py-1.5 border border-[#374151] text-[#9ca3af] text-xs font-mono hover:text-[#e5e7eb] hover:border-[#9ca3af]"
          >
            [ RETURN TO DISPATCHES ]
          </Link>
          {!user && (
            <Link
              href="/auth/signin"
              className="px-3 py-1.5 border border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66] text-xs font-mono hover:bg-[#00ff66]/20 shadow-[0_0_8px_rgba(0,255,102,0.2)]"
            >
              [ AUTHENTICATE ]
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Fetch pending posts for moderation triage
  let pendingPosts: PostWithAuthor[] = [];
  try {
    const records = await prisma.post.findMany({
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
    if (records.length > 0) {
      pendingPosts = records as PostWithAuthor[];
    }
  } catch (err) {
    // Database unreachable locally
  }

  // Fallback to demo pending dispatches for local testing if DB is empty or disconnected
  if (pendingPosts.length === 0) {
    pendingPosts = DEMO_PENDING_POSTS;
  }

  return (
    <div className="space-y-6">
      {/* Root Command Header */}
      <div className="border border-[#1f2638] bg-[#0c1018] p-4 sm:p-6 hud-chamfer-top">
        <div className="flex items-center gap-2 text-xs font-mono text-[#ff5555] mb-2">
          <Terminal className="w-4 h-4" />
          <span>root@{user?.email}:~$ sudo moderate --queue=pending</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#e5e7eb] tracking-tight">
              ROOT COMMAND & CONTROL // <span className="text-[#00ff66]">TRIAGE BUFFER</span>
            </h1>
            <p className="text-xs font-mono text-[#8b949e] mt-1">
              Review, edit, authorize, or reject incoming community dispatches before public mirroring.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-mono border border-[#ff5555]/50 bg-[#ff5555]/10 text-[#ff5555]">
              [PRIVILEGE: ROOT_LEVEL]
            </span>
          </div>
        </div>
      </div>

      {/* Moderation Table */}
      <ModerationTable initialPosts={pendingPosts} />
    </div>
  );
}
