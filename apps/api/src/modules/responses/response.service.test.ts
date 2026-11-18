import { describe, expect, it } from "vitest";
import { validateSubmission } from "./response.service.js";

const schema = {
  version: 1,
  questions: [
    {
      id: "q1",
      type: "SINGLE_CHOICE" as const,
      title: "Continue?",
      required: true,
      options: [
        { id: "yes", label: "Yes", value: "Yes" },
        { id: "no", label: "No", value: "No" }
      ]
    },
    {
      id: "q2",
      type: "TEXT" as const,
      title: "Reason",
      required: true,
      condition: { questionId: "q1", operator: "EQUALS" as const, value: "Yes" }
    },
    {
      id: "q3",
      type: "RATING" as const,
      title: "Rating",
      required: true
    },
    {
      id: "q4",
      type: "MULTIPLE_CHOICE" as const,
      title: "Languages",
      required: false,
      options: [
        { id: "js", label: "JavaScript", value: "JavaScript" },
        { id: "py", label: "Python", value: "Python" }
      ]
    }
  ]
};

describe("validateSubmission", () => {
  it("accepts a valid visible response", () => {
    expect(validateSubmission(schema, {
      q1: "Yes",
      q2: "Google",
      q3: 5,
      q4: ["JavaScript"]
    })).toEqual({
      q1: "Yes",
      q2: "Google",
      q3: 5,
      q4: ["JavaScript"]
    });
  });

  it("rejects missing required answers", () => {
    expect(() => validateSubmission(schema, { q1: "Yes" }))
      .toThrow("Required question unanswered");
  });

  it("rejects ratings outside 1-5", () => {
    expect(() => validateSubmission(schema, { q1: "Yes", q2: "Reason", q3: 8 }))
      .toThrow("Rating must be");
  });

  it("rejects invalid choice options", () => {
    expect(() => validateSubmission(schema, { q1: "Maybe", q3: 4 }))
      .toThrow("Invalid choice answer");
  });

  it("rejects hidden question answers", () => {
    expect(() => validateSubmission(schema, { q1: "No", q2: "Hidden", q3: 4 }))
      .toThrow("Answer submitted for hidden question");
  });

  it("rejects unknown question IDs", () => {
    expect(() => validateSubmission(schema, { q1: "Yes", q2: "Reason", q3: 4, unknown: "x" }))
      .toThrow("Unknown question ID");
  });

  it("rejects invalid checkbox options", () => {
    expect(() => validateSubmission(schema, { q1: "Yes", q2: "Reason", q3: 4, q4: ["Ruby"] }))
      .toThrow("Invalid checkbox answer");
  });
});
