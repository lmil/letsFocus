import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create user
  const user = await prisma.user.create({
    data: {
      email: "luthfi@letsfocus.app",
      name: "Luthfi Milham",
    },
  });
  console.log("✅ Created user:", user.email);

  // Create project
  const project = await prisma.project.create({
    data: {
      name: "LetsFocus Development",
      description: "22-week journey to become a full-stack developer",
      color: "#FF6B6B",
      userId: user.id,
    },
  });
  console.log("✅ Created project:", project.name);

  // Create Phase 1
  const phase1 = await prisma.taskGroup.create({
    data: {
      name: "Phase 1 - Foundation",
      description: "Weeks 1-6: Frontend & Backend Setup",
      color: "#FF6B6B",
      order: 1,
      userId: user.id,
      projectId: project.id,
    },
  });
  console.log("✅ Created group:", phase1.name);

  // Create Week 1
  const week1 = await prisma.taskGroup.create({
    data: {
      name: "Week 1 - Setup",
      description: "Project foundation and tooling",
      color: "#FFD93D",
      order: 1,
      parentGroupId: phase1.id,
      userId: user.id,
      projectId: project.id,
    },
  });
  console.log("✅ Created group:", week1.name);

  // Create Day 3
  const day3 = await prisma.taskGroup.create({
    data: {
      name: "Day 3 - Database Setup",
      description: "PostgreSQL and Prisma configuration",
      color: "#F38181",
      order: 3,
      parentGroupId: week1.id,
      userId: user.id,
      projectId: project.id,
    },
  });
  console.log("✅ Created group:", day3.name);

  // Create tasks for Day 3
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: "Install PostgreSQL",
        description: "Install PostgreSQL via Homebrew",
        color: "#4ECDC4",
        order: 1,
        estimatedSessions: 1,
        completedSessions: 1,
        isCompleted: true,
        userId: user.id,
        projectId: project.id,
        taskGroupId: day3.id,
      },
      {
        title: "Setup Prisma ORM",
        description: "Initialize Prisma and create schema",
        color: "#4ECDC4",
        order: 2,
        estimatedSessions: 2,
        completedSessions: 2,
        isCompleted: true,
        userId: user.id,
        projectId: project.id,
        taskGroupId: day3.id,
      },
      {
        title: "Create Database Schema",
        description: "Design and implement all 6 models",
        color: "#4ECDC4",
        order: 3,
        estimatedSessions: 3,
        completedSessions: 3,
        isCompleted: true,
        userId: user.id,
        projectId: project.id,
        taskGroupId: day3.id,
      },
      {
        title: "Test Database Connection",
        description: "Verify Prisma can query PostgreSQL",
        color: "#95E1D3",
        order: 4,
        estimatedSessions: 1,
        completedSessions: 0,
        isCompleted: false,
        userId: user.id,
        projectId: project.id,
        taskGroupId: day3.id,
      },
    ],
  });
  console.log(`✅ Created ${tasks.count} tasks`);

  // Create user settings
  const _settings = await prisma.settings.create({
    data: {
      focusDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900,
      sessionsUntilLongBreak: 4,
      autoStartBreaks: false,
      autoStartFocus: false,
      notificationSound: true,
      userId: user.id,
    },
  });
  console.log("✅ Created settings for user");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
