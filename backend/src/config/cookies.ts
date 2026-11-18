const isProduction = process.env.NODE_ENV === "production";

export const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/api/v1/auth",
};
