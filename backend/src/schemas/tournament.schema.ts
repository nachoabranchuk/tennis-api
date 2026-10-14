import { z } from "zod";
import { CATEGORIES, SURFACES } from "../models/Tournament";

export const ALLOWED_TOURNAMENT_SORT_FIELDS = ["createdAt", "name", "year", "category"] as const;

const countryCode = z
  .string()
  .trim()
  .length(3, "El pais debe ser un codigo de 3 letras (ej: FRA)")
  .regex(/^[A-Za-z]{3}$/, "El pais solo puede tener letras")
  .toUpperCase();

export const listTournamentsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(ALLOWED_TOURNAMENT_SORT_FIELDS).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  category: z.enum(CATEGORIES).optional(),
  surface: z.enum(SURFACES).optional(),
  year: z.number().int().min(1877).max(2100).optional(),
  country: countryCode.optional(),
  active: z.boolean().optional(),
  search: z.string().trim().min(1).max(120).optional(),
});

export const createTournamentSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  category: z.enum(CATEGORIES, `La categoria debe ser una de: ${CATEGORIES.join(", ")}`),
  surface: z.enum(SURFACES, `La superficie debe ser una de: ${SURFACES.join(", ")}`),
  city: z.string().trim().min(1, "La ciudad es obligatoria").max(80),
  country: countryCode,
  year: z.number().int().min(1877).max(2100),
  indoor: z.boolean().optional(),
  description: z.string().trim().max(500).optional(),
  active: z.boolean().optional(),
});

export const updateTournamentSchema = createTournamentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Se necesita al menos un campo para actualizar",
  });

export type ListTournamentsInput = z.infer<typeof listTournamentsSchema>;
export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;
