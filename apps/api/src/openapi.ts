export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Survey Builder API",
    version: "0.0.0",
    description: "Boilerplate API only. Survey feature endpoints are not implemented."
  },
  servers: [{ url: "/" }],
  paths: {
    "/health": {
      get: {
        summary: "Liveness health check",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", const: "ok" },
                    timestamp: { type: "string", format: "date-time" }
                  },
                  required: ["status", "timestamp"]
                }
              }
            }
          }
        }
      }
    },
    "/ready": {
      get: {
        summary: "Readiness check",
        responses: {
          "200": { description: "Service is ready" }
        }
      }
    }
  }
} as const;
