// Mapping between (HTTP method + path) and controller. No business logic here.
import { Router } from "express";
import {
  listTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
} from "../controllers/tournaments.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validateBody } from "../middlewares/validate";
import {
  createTournamentSchema,
  listTournamentsSchema,
  updateTournamentSchema,
} from "../schemas/tournament.schema";

const router = Router();

// Publicas: cualquiera puede consultar
router.query!("/", validateBody(listTournamentsSchema), listTournaments);
router.get("/:id", getTournamentById);

// Privada: solo usuarios autenticados (cualquier rol)
router.post("/", authMiddleware, validateBody(createTournamentSchema), createTournament);

// Privadas protegidas por rol: solo ADMIN
router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  validateBody(updateTournamentSchema),
  updateTournament
);
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteTournament);

export default router;
