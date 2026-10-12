// Aggregates every v1 resource router. New entities get mounted here, not in server.ts.
import { Router } from "express";
import playersRouter from "./players.routes";
import tournamentsRouter from "./tournaments.routes";
import authRouter from "./auth.routes";

const router = Router();

router.use("/players", playersRouter);
router.use("/tournaments", tournamentsRouter);
router.use("/auth", authRouter);

export default router;
