import { email, z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(3, "Name must contain at least 3 characters")
            .max(100, "Name cannot exceed 100 characters"),

        email: z
            .string()
            .trim()
            .email("Please enter a valid email address"),

        password: z
            .string()
            .min(6, "Password must contain at least 6 characters")
            .max(128, "Password cannot exceed 128 characters"),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().trim().email("Invalid email address"),
        password: z.string().min(4, "Password is required"),
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];