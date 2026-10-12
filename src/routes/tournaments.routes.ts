// Mapping between (HTTP method + path) and controller. No business logic here.
import { Router } from "express";
import {
  listTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
} from "../controllers/tournaments.controller";
import { validateBody } from "../middlewares/validate";
import {
  createTournamentSchema,
  listTournamentsSchema,
  updateTournamentSchema,
} from "../schemas/tournament.schema";

const router = Router();

router.query!("/", validateBody(listTournamentsSchema), listTournaments);
router.get("/:id", getTournamentById);
router.post("/", validateBody(createTournamentSchema), createTournament);
router.put("/:id", validateBody(updateTournamentSchema), updateTournament);
router.delete("/:id", deleteTournament);

export default router;
