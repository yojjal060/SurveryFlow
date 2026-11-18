import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = {
  version: 1,
  questions: [
    {
      id: "demo-name",
      type: "TEXT",
      title: "What is your name?",
      required: false,
      placeholder: "Your name"
    },
    {
      id: "demo-used",
      type: "SINGLE_CHOICE",
      title: "Have you used our product?",
      required: true,
      options: [
        { id: "demo-used-yes", label: "Yes", value: "Yes" },
        { id: "demo-used-no", label: "No", value: "No" }
      ]
    },
    {
      id: "demo-features",
      type: "MULTIPLE_CHOICE",
      title: "Which feature do you use most?",
      required: true,
      condition: { questionId: "demo-used", operator: "EQUALS", value: "Yes" },
      options: [
        { id: "demo-feature-builder", label: "Survey Builder", value: "Survey Builder" },
        { id: "demo-feature-analytics", label: "Analytics", value: "Analytics" },
        { id: "demo-feature-integrations", label: "Integrations", value: "Integrations" },
        { id: "demo-feature-response", label: "Public Responses", value: "Public Responses" }
      ]
    },
    {
      id: "demo-rating",
      type: "RATING",
      title: "How would you rate our service?",
      required: true
    },
    {
      id: "demo-improve",
      type: "TEXT",
      title: "What should we improve?",
      required: false,
      placeholder: "Share an idea",
      multiline: true
    }
  ]
};

const combinations = [
  ["Alex", "Yes", ["Survey Builder"], 5, "More templates"],
  ["Sam", "Yes", ["Analytics"], 4, "Faster reports"],
  ["Jamie", "No", [], 3, "Clearer onboarding"],
  ["Taylor", "Yes", ["Survey Builder", "Analytics"], 5, "Export options"],
  ["Morgan", "Yes", ["Integrations"], 4, "Slack integration"],
  ["Jordan", "No", [], 2, "More examples"],
  ["Casey", "Yes", ["Public Responses"], 5, "Mobile improvements"],
  ["Riley", "Yes", ["Survey Builder", "Integrations"], 4, "Team permissions"],
  ["Avery", "Yes", ["Analytics"], 5, "Custom dashboards"],
  ["Quinn", "No", [], 3, "Help documentation"],
  ["Drew", "Yes", ["Survey Builder"], 4, "Question presets"],
  ["Reese", "Yes", ["Analytics", "Public Responses"], 5, "Better charts"],
  ["Skyler", "Yes", ["Integrations"], 3, "More integrations"],
  ["Parker", "No", [], 4, "Guided setup"],
  ["Finley", "Yes", ["Survey Builder", "Analytics"], 5, "Nothing major"]
] as const;

async function main() {
  const passwordHash = await bcrypt.hash("demo-admin-1234", 12);
  await prisma.admin.upsert({
    where: { email: "demo@surveyflow.local" },
    update: {},
    create: { email: "demo@surveyflow.local", passwordHash }
  });

  const survey = await prisma.survey.upsert({
    where: { slug: "customer-experience-survey-demo" },
    update: {
      title: "Customer Experience Survey",
      description: "[DEMO DATA] Example survey for local demonstration.",
      status: "PUBLISHED",
      schema
    },
    create: {
      title: "Customer Experience Survey",
      description: "[DEMO DATA] Example survey for local demonstration.",
      slug: "customer-experience-survey-demo",
      status: "PUBLISHED",
      schema
    }
  });

  await prisma.response.deleteMany({ where: { surveyId: survey.id } });
  await prisma.response.createMany({
    data: combinations.map(([name, used, features, rating, improve]) => ({
      surveyId: survey.id,
      answers: used === "Yes"
        ? {
            "demo-name": name,
            "demo-used": used,
            "demo-features": [...features],
            "demo-rating": rating,
            "demo-improve": improve
          }
        : {
            "demo-name": name,
            "demo-used": used,
            "demo-rating": rating,
            "demo-improve": improve
          }
    }))
  });

  console.log(JSON.stringify({
    admin: "demo@surveyflow.local",
    survey: "/s/customer-experience-survey-demo",
    responses: combinations.length,
    demoData: true
  }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
