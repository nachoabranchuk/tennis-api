// Mapping between (HTTP method + path) and controller. No business logic here.
import { Router } from "express";
import {
  listPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/players.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validateBody } from "../middlewares/validate";
import { createPlayerSchema, listPlayersSchema, updatePlayerSchema } from "../schemas/player.schema";

const router = Router();

// Publicas: cualquiera puede consultar
router.query!("/", validateBody(listPlayersSchema), listPlayers);
router.get("/:id", getPlayerById);

// Privada: solo usuarios autenticados (cualquier rol)
router.post("/", authMiddleware, validateBody(createPlayerSchema), createPlayer);

// Privadas protegidas por rol: solo ADMIN
router.put("/:id", authMiddleware, requireRole("ADMIN"), validateBody(updatePlayerSchema), updatePlayer);
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deletePlayer);

export default router;
