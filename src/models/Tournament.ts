import { Schema, model, Document, Model, Types } from "mongoose";

export const CATEGORIES = ["GRAND_SLAM", "MASTERS_1000", "ATP_500", "ATP_250"] as const;
export const SURFACES = ["HARD", "CLAY", "GRASS", "CARPET"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Surface = (typeof SURFACES)[number];

export interface ITournament {
  name: string;
  category: Category;
  surface: Surface;
  city: string;
  country: string; // codigo de 3 letras
  year: number;
  indoor: boolean;
  description: string;
  active: boolean;
}

export interface ITournamentDocument extends ITournament, Document {
  _id: Types.ObjectId;
}

const tournamentSchema = new Schema<ITournamentDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, "Category is required"],
    },
    surface: {
      type: String,
      enum: SURFACES,
      required: [true, "Surface is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [80, "City cannot exceed 80 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      uppercase: true,
      minlength: [3, "Country must be a 3-letter code"],
      maxlength: [3, "Country must be a 3-letter code"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1877, "Year must be 1877 or later"],
      max: [2100, "Year cannot exceed 2100"],
    },
    indoor: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Un torneo se identifica por nombre + anio.
tournamentSchema.index({ name: 1, year: 1 }, { unique: true });

const Tournament: Model<ITournamentDocument> = model<ITournamentDocument>(
  "Tournament",
  tournamentSchema
);

export default Tournament;
