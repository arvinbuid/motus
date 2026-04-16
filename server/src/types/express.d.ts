import type {AuthenticatedUser} from "../middleware/auth.js";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedUser;
    }
  }
}

export {};
