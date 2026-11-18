import { SignJWT, jwtVerify } from "jose";
import { authConfig } from "../../config/auth.js";

interface AccessTokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = async (
  payload: AccessTokenPayload
): Promise<string> => {
  return new SignJWT({
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .setIssuer("project-management-api")
    .setAudience("project-management-client")
    .sign(authConfig.accessTokenSecret);
};

export const verifyAccessToken = async (token: string) => {
  const { payload } = await jwtVerify(
    token,
    authConfig.accessTokenSecret,
    {
      issuer: "project-management-api",
      audience: "project-management-client",
      algorithms: ["HS256"],
    }
  );

  return payload;
};