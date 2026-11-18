import { describe, expect, it } from "vitest";
import { surveySchemaDefinition } from "./survey-validator.js";

describe("surveySchemaDefinition", () => {
  it("accepts a valid schema", () => {
    const result = surveySchemaDefinition.safeParse({
      version: 1,
      questions: [{
        id: "q1",
        type: "TEXT",
        title: "Name",
        required: true
      }]
    });
    expect(result.success).toBe(true);
  });

  it("rejects duplicate question IDs", () => {
    const result = surveySchemaDefinition.safeParse({
      version: 1,
      questions: [
        { id: "q1", type: "TEXT", title: "Name", required: true },
        { id: "q1", type: "RATING", title: "Rating", required: false }
      ]
    });
    expect(result.success).toBe(false);
  });

  it("rejects conditions that reference later or unsupported questions", () => {
    const result = surveySchemaDefinition.safeParse({
      version: 1,
      questions: [
        { id: "q1", type: "TEXT", title: "Name", required: true, condition: {
          questionId: "q2", operator: "EQUALS", value: "Yes"
        } },
        { id: "q2", type: "TEXT", title: "Later", required: false }
      ]
    });
    expect(result.success).toBe(false);
  });
});
