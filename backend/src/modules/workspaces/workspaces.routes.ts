import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { requireWorkspaceRole } from "../../middleware/requireWorkspaceRole.js";

import {
  addWorkspaceMember,
  createWorkspace,
  deleteWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
} from "./workspaces.controller.js";

import {
  addWorkspaceMemberSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "./workspaces.validation.js";

const router = Router();

router.use(requireAuth);

// CREATE WORKSPACE
router.post(
  "/",
  validateRequest(createWorkspaceSchema),
  (req, res, next) => {
    /*
      #swagger.tags = ['Workspaces']
      #swagger.summary = 'Create workspace'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "slug"],
              properties: {
                name: {
                  type: "string",
                  example: "Engineering Team"
                },
                slug: {
                  type: "string",
                  example: "engineering-team"
                }
              }
            }
          }
        }
      }
    */

    return createWorkspace(req, res, next);
  }
);

// GET MY WORKSPACES
router.get("/", (req, res, next) => {
  /*
    #swagger.tags = ['Workspaces']
    #swagger.summary = 'Get my workspaces'
    #swagger.security = [{ "bearerAuth": [] }]
  */

  return getMyWorkspaces(req, res, next);
});

// GET WORKSPACE BY ID
router.get("/:id", (req, res, next) => {
  /*
    #swagger.tags = ['Workspaces']
    #swagger.summary = 'Get workspace by ID'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'Workspace ID'
    }
  */

  return getWorkspaceById(req, res, next);
});

// UPDATE WORKSPACE
router.patch(
  "/:id",
  requireWorkspaceRole("OWNER", "ADMIN"),
  validateRequest(updateWorkspaceSchema),
  (req, res, next) => {
    /*
      #swagger.tags = ['Workspaces']
      #swagger.summary = 'Update workspace'
      #swagger.security = [{ "bearerAuth": [] }]

      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'Workspace ID'
      }

      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Engineering Team"
                },
                slug: {
                  type: "string",
                  example: "engineering-team"
                }
              }
            }
          }
        }
      }
    */

    return updateWorkspace(req, res, next);
  }
);

// DELETE WORKSPACE
router.delete(
  "/:id",
  requireWorkspaceRole("OWNER"),
  (req, res, next) => {
    /*
      #swagger.tags = ['Workspaces']
      #swagger.summary = 'Delete workspace'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'Workspace ID'
      }
    */

    return deleteWorkspace(req, res, next);
  }
);

// ADD WORKSPACE MEMBER
router.post(
  "/:id/members",
  requireWorkspaceRole("OWNER", "ADMIN"),
  validateRequest(addWorkspaceMemberSchema),
  (req, res, next) => {
    /*
      #swagger.tags = ['Workspaces']
      #swagger.summary = 'Add workspace member'
      #swagger.security = [{ "bearerAuth": [] }]

      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'Workspace ID'
      }

      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: {
                  type: "string",
                  example: "member@example.com"
                },
                role: {
                  type: "string",
                  enum: ["ADMIN", "MEMBER"],
                  example: "MEMBER"
                }
              }
            }
          }
        }
      }
    */

    return addWorkspaceMember(req, res, next);
  }
);

// LIST WORKSPACE MEMBERS
// router.get(
//   "/:id/members",
//   validateRequest(listWorkspaceMembersSchema),
//   (req, res, next) => {
//     /*
//       #swagger.tags = ['Workspaces']
//       #swagger.summary = 'List workspace members'
//       #swagger.security = [{ "bearerAuth": [] }]

//       #swagger.parameters['id'] = {
//         in: 'path',
//         required: true,
//         type: 'string',
//         description: 'Workspace ID'
//       }

//       #swagger.parameters['page'] = {
//         in: 'query',
//         type: 'integer',
//         example: 1
//       }

//       #swagger.parameters['limit'] = {
//         in: 'query',
//         type: 'integer',
//         example: 10
//       }

//       #swagger.parameters['search'] = {
//         in: 'query',
//         type: 'string',
//         example: 'john'
//       }

//       #swagger.parameters['role'] = {
//         in: 'query',
//         type: 'string',
//         enum: ['OWNER', 'ADMIN', 'MEMBER']
//       }
//     */

//     return getWorkspaceMembers(req, res, next);
//   }
// );

export default router;
