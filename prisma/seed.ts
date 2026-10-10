import { PrismaClient, PostCategory, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Initializing database seed for sudo update...");

  // Create default root administrator
  const adminUser = await prisma.user.upsert({
    where: { email: "root@sudoupdate.dev" },
    update: { isAdmin: true },
    create: {
      email: "root@sudoupdate.dev",
      name: "root_operator",
      isAdmin: true,
      image: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
    },
  });

  const demoPosts = [
    {
      title: "Linux Kernel 6.14 Merges Real-Time PREEMPT_RT Support",
      category: PostCategory.TECH,
      content:
        "After decades of development outside the main tree, the PREEMPT_RT real-time compute patchset has completed its mainline integration into the core Linux kernel. Deterministic industrial automation and embedded robotics now gain first-class kernel support.",
      sourceUrl: "https://kernelnewbies.org",
      imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.APPROVED,
      authorId: adminUser.id,
    },
    {
      title: "DeepMind Open-Sources AlphaGeometry 2 Verification Weights",
      category: PostCategory.AI,
      content:
        "AlphaGeometry 2 solves 83% of Olympiad geometry benchmarks at gold-medal competition standards. The codebase combines neuro-symbolic theorem provers with specialized search trees for rigorous algebraic geometry.",
      sourceUrl: "https://deepmind.google/discover/blog",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.APPROVED,
      authorId: adminUser.id,
    },
    {
      title: "VCT Champions Grand Finals Smashes Global Peak Concurrent Viewership",
      category: PostCategory.ESPORTS,
      content:
        "Over 3.4 million peak concurrent viewers tuned into the double-overtime map 5 finish. Tactical shooter esports viewership continues to outpace traditional regional broadcasts.",
      sourceUrl: "https://esportsobserver.com",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.APPROVED,
      authorId: adminUser.id,
    },
    {
      title: "Blade Runner 2099 Completes Principle Photography in Prague",
      category: PostCategory.CINEMA,
      content:
        "Amazon MGM's direct television sequel to 2049 has wrapped principal filming on 65mm digital anamorphic cinema glass. Directed by Jonathan van Tulleken with Ridley Scott executive producing.",
      sourceUrl: "https://variety.com",
      imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.APPROVED,
      authorId: adminUser.id,
    },
    {
      title: "FIA Approves Active Aerodynamics Specification for 2026 Power Units",
      category: PostCategory.SPORTS,
      content:
        "Formula 1 confirms active aero wing profiles to counterbalance reduced drag coefficients alongside 50% electrical battery kinetic output beginning in the 2026 regulatory cycle.",
      sourceUrl: "https://formula1.com",
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.APPROVED,
      authorId: adminUser.id,
    },
    {
      title: "Subsea Quantum Key Distribution Cable Established Across English Channel",
      category: PostCategory.GLOBAL_NEWS,
      content:
        "Researchers complete the first operational subsea entanglement link exchanging continuous variable quantum keys across international marine borders at high repeat rates.",
      sourceUrl: "https://nature.com",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.APPROVED,
      authorId: adminUser.id,
    },
  ];

  for (const post of demoPosts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log(`Seed completed: Created root admin and ${demoPosts.length} demo dispatches.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
