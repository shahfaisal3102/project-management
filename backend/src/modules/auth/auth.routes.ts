
import { Router } from "express";

import {
    getMe,
    login,
    logout,
    refresh,
    register,
} from "./auth.controller.js";

import {
    loginSchema,
    registerSchema,
} from "./auth.validation.js";

import { validateRequest } from "../../middleware/validateRequest.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();

// REGISTER
router.post(
    "/register",
    validateRequest(registerSchema),
    (req, res, next) => {
        /*
          #swagger.tags = ['Authentication']
          #swagger.summary = 'Register a new user'
    
          #swagger.requestBody = {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: {
                      type: "string",
                      example: "John Doe"
                    },
                    email: {
                      type: "string",
                      example: "user@example.com"
                    },
                    password: {
                      type: "string",
                      example: "StrongPassword123!"
                    }
                  }
                }
              }
            }
          }
        */

        return register(req, res, next);
    }
);

// LOGIN
router.post(
    "/login",
    validateRequest(loginSchema),
    (req, res, next) => {
        /*
          #swagger.tags = ['Authentication']
          #swagger.summary = 'Login user'
    
          #swagger.requestBody = {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      example: "user@example.com"
                    },
                    password: {
                      type: "string",
                      example: "StrongPassword123!"
                    }
                  }
                }
              }
            }
          }
        */

        return login(req, res, next);
    }
);

// REFRESH TOKEN
router.post(
    "/refresh",
    (req, res, next) => {
        /*
          #swagger.tags = ['Authentication']
          #swagger.summary = 'Refresh access token'
        */

        return refresh(req, res, next);
    }
);

// LOGOUT
router.post(
    "/logout",
    (req, res, next) => {
        /*
          #swagger.tags = ['Authentication']
          #swagger.summary = 'Logout user'
        */

        return logout(req, res, next);
    }
);

// CURRENT USER
router.get(
    "/me",
    requireAuth,
    (req, res, next) => {
        /*
          #swagger.tags = ['Authentication']
          #swagger.summary = 'Get current user'
        */

        return getMe(req, res, next);
    }
);

export default router;
