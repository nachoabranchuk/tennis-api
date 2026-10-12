import { Request, Response } from "express";
import { QueryFilter, isValidObjectId } from "mongoose";
import Tournament, { ITournamentDocument } from "../models/Tournament";
import {
  CreateTournamentInput,
  ListTournamentsInput,
  UpdateTournamentInput,
} from "../schemas/tournament.schema";

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

// QUERY /api/v1/tournaments
// Body example: { "category": "GRAND_SLAM", "surface": "CLAY", "year": 2026, "search": "roland" }
export async function listTournaments(
  req: Request<{}, {}, ListTournamentsInput>,
  res: Response
): Promise<void> {
  const { category, surface, year, country, active, search, page, limit, sortBy, sortOrder } =
    req.body;
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const filter: QueryFilter<ITournamentDocument> = {};
  if (category) filter.category = category;
  if (surface) filter.surface = surface;
  if (year !== undefined) filter.year = year;
  if (country) filter.country = country;
  if (active !== undefined) filter.active = active;
  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { city: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
    ];
  }

  try {
    const skip = (page - 1) * limit;

    const [tournaments, total] = await Promise.all([
      Tournament.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit),
      Tournament.countDocuments(filter),
    ]);

    res.status(200).json({
      data: tournaments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[tournaments] error listing:", error);
    res.status(500).json({ error: "Could not fetch tournaments" });
  }
}

export async function getTournamentById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "The provided id is not valid" });
    return;
  }

  try {
    const tournament = await Tournament.findById(id);

    if (!tournament) {
      res.status(404).json({ error: "Tournament not found" });
      return;
    }

    res.status(200).json(tournament);
  } catch (error) {
    console.error("[tournaments] error fetching by id:", error);
    res.status(500).json({ error: "Could not fetch the tournament" });
  }
}

export async function createTournament(
  req: Request<{}, {}, CreateTournamentInput>,
  res: Response
): Promise<void> {
  try {
    const newTournament = await Tournament.create(req.body);
    res.status(201).json(newTournament);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }

    if (isDuplicateKeyError(error)) {
      res.status(409).json({ error: "A tournament with this name and year already exists" });
      return;
    }

    console.error("[tournaments] error creating:", error);
    res.status(500).json({ error: "Could not create the tournament" });
  }
}

export async function updateTournament(
  req: Request<{ id: string }, {}, UpdateTournamentInput>,
  res: Response
): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "The provided id is not valid" });
    return;
  }

  try {
    const updatedTournament = await Tournament.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTournament) {
      res.status(404).json({ error: "Tournament not found" });
      return;
    }

    res.status(200).json(updatedTournament);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }

    if (isDuplicateKeyError(error)) {
      res.status(409).json({ error: "A tournament with this name and year already exists" });
      return;
    }

    console.error("[tournaments] error updating:", error);
    res.status(500).json({ error: "Could not update the tournament" });
  }
}

export async function deleteTournament(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "The provided id is not valid" });
    return;
  }

  try {
    const deletedTournament = await Tournament.findByIdAndDelete(id);

    if (!deletedTournament) {
      res.status(404).json({ error: "Tournament not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("[tournaments] error deleting:", error);
    res.status(500).json({ error: "Could not delete the tournament" });
  }
}
