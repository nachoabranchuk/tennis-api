import { z } from "zod";
import { BACKHANDS, HANDS } from "../models/Player";

export const ALLOWED_PLAYER_SORT_FIELDS = [
  "createdAt",
  "firstName",
  "lastName",
  "birthDate",
  "ranking",
  "grandSlams",
] as const;

const countryCode = z
  .string()
  .trim()
  .length(3, "El pais debe ser un codigo de 3 letras (ej: ARG)")
  .regex(/^[A-Za-z]{3}$/, "El pais solo puede tener letras")
  .toUpperCase();

export const listPlayersSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(ALLOWED_PLAYER_SORT_FIELDS).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  country: countryCode.optional(),
  hand: z.enum(HANDS).optional(),
  backhand: z.enum(BACKHANDS).optional(),
  active: z.boolean().optional(),
  search: z.string().trim().min(1).max(120).optional(),
});

export const createPlayerSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es obligatorio").max(80),
  lastName: z.string().trim().min(1, "El apellido es obligatorio").max(80),
  country: countryCode,
  birthDate: z.iso
    .date("La fecha debe tener formato YYYY-MM-DD")
    .refine((value) => new Date(value) < new Date(), "La fecha de nacimiento debe ser pasada"),
  hand: z.enum(HANDS, "La mano debe ser RIGHT o LEFT"),
  backhand: z.enum(BACKHANDS, "El reves debe ser ONE_HANDED o TWO_HANDED"),
  heightCm: z.number().int().min(140).max(230).optional(),
  ranking: z.number().int().min(1, "El ranking minimo es 1").optional(),
  grandSlams: z.number().int().min(0).max(30).optional(),
  bio: z.string().trim().max(500).optional(),
  active: z.boolean().optional(),
});

export const updatePlayerSchema = createPlayerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Se necesita al menos un campo para actualizar",
  });

export type ListPlayersInput = z.infer<typeof listPlayersSchema>;
export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
