import { Schema, model, Document, Model, Types } from "mongoose";

export const HANDS = ["RIGHT", "LEFT"] as const;
export const BACKHANDS = ["ONE_HANDED", "TWO_HANDED"] as const;

export type Hand = (typeof HANDS)[number];
export type Backhand = (typeof BACKHANDS)[number];

export interface IPlayer {
  firstName: string;
  lastName: string;
  country: string; // codigo de 3 letras (ARG, ESP, SRB...)
  birthDate: Date;
  hand: Hand;
  backhand: Backhand;
  heightCm?: number;
  ranking?: number;
  grandSlams?: number;
  bio: string;
  active: boolean;
}

export interface IPlayerDocument extends IPlayer, Document {
  _id: Types.ObjectId;
}

const playerSchema = new Schema<IPlayerDocument>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [80, "First name cannot exceed 80 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [80, "Last name cannot exceed 80 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      uppercase: true,
      minlength: [3, "Country must be a 3-letter code"],
      maxlength: [3, "Country must be a 3-letter code"],
    },
    birthDate: {
      type: Date,
      required: [true, "Birth date is required"],
    },
    hand: {
      type: String,
      enum: HANDS,
      required: [true, "Dominant hand is required"],
    },
    backhand: {
      type: String,
      enum: BACKHANDS,
      required: [true, "Backhand type is required"],
    },
    heightCm: {
      type: Number,
      min: [140, "Height must be at least 140 cm"],
      max: [230, "Height cannot exceed 230 cm"],
    },
    ranking: {
      type: Number,
      min: [1, "Ranking must be at least 1"],
    },
    grandSlams: {
      type: Number,
      min: [0, "Grand Slams cannot be negative"],
    },
    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
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

// Evita cargar dos veces al mismo jugador.
playerSchema.index({ firstName: 1, lastName: 1, country: 1 }, { unique: true });

const Player: Model<IPlayerDocument> = model<IPlayerDocument>("Player", playerSchema);

export default Player;
