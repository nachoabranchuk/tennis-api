import { Request, Response } from "express";
import { QueryFilter, isValidObjectId } from "mongoose";
import Player, { IPlayerDocument } from "../models/Player";
import { CreatePlayerInput, ListPlayersInput, UpdatePlayerInput } from "../schemas/player.schema";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === 11000
  );
}

// QUERY /api/v1/players
// Body example: { "country": "ARG", "hand": "LEFT", "search": "rafa", "sortBy": "ranking", "sortOrder": "asc" }
export async function listPlayers(
  req: Request<{}, {}, ListPlayersInput>,
  res: Response
): Promise<void> {
  const { country, hand, backhand, active, search, page, limit, sortBy, sortOrder } = req.body;
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  // Filtro armado solo con campos permitidos: nunca se esparce req.body en la query.
  const filter: QueryFilter<IPlayerDocument> = {};
  if (country) filter.country = country;
  if (hand) filter.hand = hand;
  if (backhand) filter.backhand = backhand;
  if (active !== undefined) filter.active = active;
  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { firstName: { $regex: safeSearch, $options: "i" } },
      { lastName: { $regex: safeSearch, $options: "i" } },
    ];
  }

  try {
    const skip = (page - 1) * limit;

    const [players, total] = await Promise.all([
      Player.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit),
      Player.countDocuments(filter),
    ]);

    res.status(200).json({
      data: players,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[players] error listing:", error);
    res.status(500).json({ error: "Could not fetch players" });
  }
}

export async function getPlayerById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "The provided id is not valid" });
    return;
  }

  try {
    const player = await Player.findById(id);

    if (!player) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    res.status(200).json(player);
  } catch (error) {
    console.error("[players] error fetching by id:", error);
    res.status(500).json({ error: "Could not fetch the player" });
  }
}

export async function createPlayer(
  req: Request<{}, {}, CreatePlayerInput>,
  res: Response
): Promise<void> {
  try {
    const newPlayer = await Player.create(req.body);
    res.status(201).json(newPlayer);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }

    if (isDuplicateKeyError(error)) {
      res.status(409).json({ error: "This player already exists" });
      return;
    }

    console.error("[players] error creating:", error);
    res.status(500).json({ error: "Could not create the player" });
  }
}

export async function updatePlayer(
  req: Request<{ id: string }, {}, UpdatePlayerInput>,
  res: Response
): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "The provided id is not valid" });
    return;
  }

  try {
    const updatedPlayer = await Player.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlayer) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    res.status(200).json(updatedPlayer);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }

    if (isDuplicateKeyError(error)) {
      res.status(409).json({ error: "This player already exists" });
      return;
    }

    console.error("[players] error updating:", error);
    res.status(500).json({ error: "Could not update the player" });
  }
}

export async function deletePlayer(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "The provided id is not valid" });
    return;
  }

  try {
    const deletedPlayer = await Player.findByIdAndDelete(id);

    if (!deletedPlayer) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("[players] error deleting:", error);
    res.status(500).json({ error: "Could not delete the player" });
  }
}
