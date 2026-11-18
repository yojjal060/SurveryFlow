export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Survey Builder API",
    version: "1.0.0"
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": {
      post: {
        security: [],
        summary: "Register an admin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: { email: "admin@example.com", password: "minimum-8-chars" }
            }
          }
        },
        responses: { "201": { description: "Admin created" } }
      }
    },
    "/auth/login": {
      post: {
        security: [],
        summary: "Log in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: { email: "admin@example.com", password: "minimum-8-chars" }
            }
          }
        },
        responses: { "200": { description: "Login result and access token" } }
      }
    },
    "/surveys": {
      get: { summary: "List surveys", responses: { "200": { description: "Survey list" } } },
      post: {
        summary: "Create survey",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: { title: "Customer Survey", description: "Customer feedback" }
            }
          }
        },
        responses: { "201": { description: "Survey created" } }
      }
    },
    "/surveys/{id}": {
      get: { parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Survey" } } },
      patch: {
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              example: {
                schema: {
                  version: 1,
                  questions: [
                    { id: "q1", type: "TEXT", title: "Name", required: true }
                  ]
                }
              }
            }
          }
        },
        responses: { "200": { description: "Updated survey" } }
      },
      delete: {
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Deleted" } }
      }
    },
    "/surveys/{id}/publish": {
      post: {
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Published survey" } }
      }
    },
    "/public/surveys/{slug}": {
      get: {
        security: [],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Published survey" } }
      }
    },
    "/public/surveys/{slug}/responses": {
      post: {
        security: [],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: { answers: { q1: "Ada" } }
            }
          }
        },
        responses: { "201": { description: "Response submitted" }, "400": { description: "Invalid response" } }
      }
    },
    "/surveys/{id}/responses": {
      get: {
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Paginated responses" } }
      }
    },
    "/surveys/{id}/analytics": {
      get: {
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Aggregated analytics" } }
      }
    }
  }
} as const;
