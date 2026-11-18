
import swaggerAutogen from "swagger-autogen";

const swaggerGenerator = swaggerAutogen({
  openapi: "3.0.0",
});

const doc = {
  info: {
    title: "Project Management API",
    version: "1.0.0",
    description:
      "API documentation for the Project Management application",
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Development server",
    },
  ],

  tags: [
    {
      name: "Authentication",
      description: "Registration, login, refresh and logout",
    },
    {
      name: "Workspaces",
      description: "Workspace and workspace member management",
    },
    {
      name: "Projects",
      description: "Project management",
    },
    {
      name: "Tasks",
      description: "Task management",
    },
    {
      name: "Users",
      description: "User management",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      ApiError: {
        success: false,
        message: "Something went wrong",
      },
    },
  },
};

// Important: scan the Express application entry point.
// It mounts the individual module routers.
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

swaggerGenerator(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated successfully");
});
