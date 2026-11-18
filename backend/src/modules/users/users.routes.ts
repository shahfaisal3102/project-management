import { Router } from "express";
import { getUserById, getUsers } from "./users.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { userIdSchema } from "./users.validation.js";


const router = Router();

router.get("/", getUsers);
router.get( "/:id", validateRequest(userIdSchema), getUserById );

export default router;