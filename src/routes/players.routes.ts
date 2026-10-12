// Mapping between (HTTP method + path) and controller. No business logic here.
import { Router } from "express";
import {
  listPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/players.controller";
import { validateBody } from "../middlewares/validate";
import { createPlayerSchema, listPlayersSchema, updatePlayerSchema } from "../schemas/player.schema";

const router = Router();

router.query!("/", validateBody(listPlayersSchema), listPlayers);
router.get("/:id", getPlayerById);
router.post("/", validateBody(createPlayerSchema), createPlayer);
router.put("/:id", validateBody(updatePlayerSchema), updatePlayer);
router.delete("/:id", deletePlayer);

export default router;
