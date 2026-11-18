import "dotenv/config";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

if (!accessTokenSecret || accessTokenSecret.length < 32) {
    throw new Error(
        "ACCESS_TOKEN_SECRET must contain at least 32 characters"
    );
}

const refreshTokenExpiresDays = Number(
    process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? 7
);

if (
    !Number.isInteger(refreshTokenExpiresDays) ||
    refreshTokenExpiresDays <= 0
) {
    throw new Error("Invalid refresh token expiry configuration");
}

export const authConfig = {
    accessTokenSecret: new TextEncoder().encode(accessTokenSecret),

    accessTokenExpiresIn: "15m",

    refreshTokenExpiresDays,
};