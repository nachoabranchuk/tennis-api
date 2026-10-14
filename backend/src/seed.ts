// Carga datos de ejemplo para probar la API: npm run seed
// Ojo: borra las colecciones players y tournaments antes de insertar.
import "dotenv/config";
import bcrypt from "bcrypt";
import Player from "./models/Player";
import Tournament from "./models/Tournament";
import User from "./models/User";
import { connectMongoDB, disconnectMongoDB } from "./config/db";
import { createPlayerSchema } from "./schemas/player.schema";
import { createTournamentSchema } from "./schemas/tournament.schema";

const players = [
  {
    firstName: "Roger",
    lastName: "Federer",
    country: "SUI",
    birthDate: "1981-08-08",
    hand: "RIGHT",
    backhand: "ONE_HANDED",
    grandSlams: 20,
    active: false,
  },
  {
    firstName: "Rafael",
    lastName: "Nadal",
    country: "ESP",
    birthDate: "1986-06-03",
    hand: "LEFT",
    backhand: "TWO_HANDED",
    grandSlams: 22,
    active: false,
  },
  {
    firstName: "Juan Martin",
    lastName: "Del Potro",
    country: "ARG",
    birthDate: "1988-09-23",
    hand: "RIGHT",
    backhand: "TWO_HANDED",
    grandSlams: 1,
    active: false,
  },
  {
    firstName: "Novak",
    lastName: "Djokovic",
    country: "SRB",
    birthDate: "1987-05-22",
    hand: "RIGHT",
    backhand: "TWO_HANDED",
  },
  {
    firstName: "Carlos",
    lastName: "Alcaraz",
    country: "ESP",
    birthDate: "2003-05-05",
    hand: "RIGHT",
    backhand: "TWO_HANDED",
  },
  {
    firstName: "Jannik",
    lastName: "Sinner",
    country: "ITA",
    birthDate: "2001-08-16",
    hand: "RIGHT",
    backhand: "TWO_HANDED",
  },
];

const tournaments = [
  { name: "Australian Open", category: "GRAND_SLAM", surface: "HARD", city: "Melbourne", country: "AUS", year: 2026 },
  { name: "Roland Garros", category: "GRAND_SLAM", surface: "CLAY", city: "Paris", country: "FRA", year: 2026 },
  { name: "Wimbledon", category: "GRAND_SLAM", surface: "GRASS", city: "Londres", country: "GBR", year: 2026 },
  { name: "US Open", category: "GRAND_SLAM", surface: "HARD", city: "Nueva York", country: "USA", year: 2026 },
  { name: "Argentina Open", category: "ATP_250", surface: "CLAY", city: "Buenos Aires", country: "ARG", year: 2026 },
];

async function seed(): Promise<void> {
  await connectMongoDB();

  // Pasamos los datos por los mismos schemas de Zod que usa la API.
  const validPlayers = players.map((p) => createPlayerSchema.parse(p));
  const validTournaments = tournaments.map((t) => createTournamentSchema.parse(t));

  await Promise.all([Player.deleteMany({}), Tournament.deleteMany({})]);
  await Player.insertMany(validPlayers);
  await Tournament.insertMany(validTournaments);

  console.log(`[seed] ${validPlayers.length} players, ${validTournaments.length} tournaments`);

  // Usuario ADMIN para probar las rutas protegidas por rol. La API no permite elegir el rol al
  // registrarse (todos entran como USER), asi que el admin se crea aca. Se puede cambiar por .env.
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@tennis.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin1234";

  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
    { upsert: true, runValidators: true }
  );

  console.log(`[seed] admin user ready: ${adminEmail}`);
}

seed()
  .catch((error: unknown) => {
    console.error("[seed] failed:", error);
    process.exitCode = 1;
  })
  .finally(disconnectMongoDB);
