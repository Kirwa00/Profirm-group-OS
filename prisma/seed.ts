import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const VENTURES = [
  {
    key: "ai-startup-studio",
    name: "AI Startup Studio",
    emoji: "🚀",
    category: "AI_STARTUP_STUDIO" as const,
    status: "VALIDATING" as const,
    description: "PRDs, SDLCs, MVP plans, TAM/SAM/SOM models, competitive analyses.",
  },
  {
    key: "ai-automation-agents",
    name: "AI Automation & Agents",
    emoji: "🤖",
    category: "AI_AUTOMATION_AGENTS" as const,
    status: "BUILDING" as const,
    description: "n8n workflow maps, OCR/document automation specs, integration lists.",
  },
  {
    key: "trading-quant-research",
    name: "Trading & Quant Research",
    emoji: "📈",
    category: "TRADING_QUANT_RESEARCH" as const,
    status: "IDEA" as const,
    description: "ICT strategy notes, MT5 EA specs (MQL5), backtest reports, risk rules.",
  },
  {
    key: "manufacturing-industrial-ventures",
    name: "Manufacturing & Industrial Ventures",
    emoji: "🏭",
    category: "MANUFACTURING_INDUSTRIAL" as const,
    status: "IDEA" as const,
    description:
      "Feasibility studies (grain milling, turpentine, avocado oil, briquettes, fertilizer, fuel wood), machinery specs, production costing sheets.",
  },
  {
    key: "migingo-gold-project",
    name: "Migingo Gold Project",
    emoji: "⛏️",
    category: "MINING_COMMODITIES" as const,
    status: "VALIDATING" as const,
    description: "CIL plant design, mining financial model, investor deck.",
  },
  {
    key: "suluhu-therapy-centre",
    name: "Suluhu Therapy Centre",
    emoji: "🏥",
    category: "HEALTHCARE_BUSINESSES" as const,
    status: "SCALING" as const,
    description:
      "Marketing plan, growth strategy, HR policies, acquisition funnel. Has its own dedicated telehealth platform (M0-M9 built separately) — tracked here at a portfolio level only.",
  },
  {
    key: "personal-health",
    name: "Personal Health",
    emoji: "❤️",
    category: "PERSONAL_HEALTH" as const,
    status: "BUILDING" as const,
    description: "Anti-inflammatory diet plan, meal plans, supplement protocol, exercise plan.",
  },
  {
    key: "trans-africa-equator-hotels",
    name: "Trans Africa Equator Hotels",
    emoji: "🏨",
    category: "PROPERTY_HOSPITALITY" as const,
    status: "IDEA" as const,
    description: "Real estate concepts, tourism strategy.",
  },
  {
    key: "highlands-institute",
    name: "Highlands Institute",
    emoji: "🎓",
    category: "EDUCATION_VENTURES" as const,
    status: "VALIDATING" as const,
    description: "Marketing plan, student acquisition funnel, operations manual.",
  },
  {
    key: "ai-knowledge-base",
    name: "AI Knowledge Base",
    emoji: "📚",
    category: "AI_KNOWLEDGE_BASE" as const,
    status: "BUILDING" as const,
    description: "Prompt libraries, folder structures, PKM system notes.",
  },
  {
    key: "legal-finance",
    name: "Legal & Finance",
    emoji: "⚖️",
    category: "LEGAL_FINANCE" as const,
    status: "IDEA" as const,
    description: "Contracts, invoice templates, compliance checklist, tax calendar.",
  },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@profirmgroup.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ProfirmOS2026!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Profirm Admin",
      passwordHash: hashPassword(adminPassword),
      role: "ADMIN",
    },
  });
  console.log(`Seeded admin user: ${adminEmail} / ${adminPassword}`);

  for (const [index, v] of VENTURES.entries()) {
    await prisma.venture.upsert({
      where: { key: v.key },
      update: {},
      create: { ...v, rank: index },
    });
  }
  console.log(`Seeded ${VENTURES.length} ventures.`);

  const migingo = await prisma.venture.findUnique({ where: { key: "migingo-gold-project" } });
  if (migingo) {
    const existingPriorities = await prisma.priority.count({ where: { ventureId: migingo.id } });
    if (existingPriorities === 0) {
      await prisma.priority.createMany({
        data: [
          { ventureId: migingo.id, text: "Finalize CIL plant financial sensitivity model", rank: 0 },
          { ventureId: migingo.id, text: "Complete geological survey sign-off", rank: 1 },
          { ventureId: migingo.id, text: "Lock mine planning & fleet operations budget", rank: 2 },
        ],
      });
    }
    const existingDecisions = await prisma.decision.count({ where: { ventureId: migingo.id } });
    if (existingDecisions === 0) {
      await prisma.decision.create({
        data: { ventureId: migingo.id, text: "Confirm investor deck terms before next raise" },
      });
    }
  }

  const suluhu = await prisma.venture.findUnique({ where: { key: "suluhu-therapy-centre" } });
  if (suluhu) {
    const existingPriorities = await prisma.priority.count({ where: { ventureId: suluhu.id } });
    if (existingPriorities === 0) {
      await prisma.priority.createMany({
        data: [
          { ventureId: suluhu.id, text: "Review acquisition funnel conversion rate", rank: 0 },
          { ventureId: suluhu.id, text: "Ship M10 milestone on the therapy center platform", rank: 1 },
        ],
      });
    }
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
