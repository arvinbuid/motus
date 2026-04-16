import {createRemoteJWKSet, jwtVerify, type JWTPayload} from "jose";
import type {NextFunction, Request, Response} from "express";

export interface AuthenticatedUser {
  userId: string;
  payload: JWTPayload;
}

const authBaseUrl = process.env.NEON_AUTH_BASE_URL;

if (!authBaseUrl) {
  throw new Error("NEON_AUTH_BASE_URL is required to validate authenticated requests.");
}

const issuerCandidates = [authBaseUrl, new URL(authBaseUrl).origin];
const neonJwks = createRemoteJWKSet(new URL(`${authBaseUrl}/.well-known/jwks.json`));

function getBearerToken(request: Request) {
  const authorizationHeader = request.header("authorization");

  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function validateNeonToken(token: string) {
  const {payload} = await jwtVerify(token, neonJwks, {
    issuer: issuerCandidates,
  });

  const userId = typeof payload.sub === "string" ? payload.sub : null;

  if (!userId) {
    throw new Error("Token payload is missing a subject claim.");
  }

  return {
    userId,
    payload,
  };
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({error: "Authorization token is required"});
  }

  try {
    req.auth = await validateNeonToken(token);
    next();
  } catch (error) {
    console.error("Token validation failed:", error);
    return res.status(401).json({error: "Invalid or expired authorization token"});
  }
}
