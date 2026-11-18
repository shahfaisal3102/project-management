import { z } from "zod";

export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(100),
    slug: z
      .string()
      .trim()
      .min(3)
      .max(50)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  }),
});

export const updateWorkspaceSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(3).max(100).optional(),
      slug: z
        .string()
        .trim()
        .min(3)
        .max(50)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .optional(),
    })
    .refine(
      (data) => data.name !== undefined || data.slug !== undefined,
      {
        message: "At least one field is required",
      }
    ),
});

export const addWorkspaceMemberSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address"),

    role: z.enum(["ADMIN", "MEMBER"]).optional(),
  }),
});