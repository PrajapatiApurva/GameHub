import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
  gamesWon: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GameSessionSchema = new mongoose.Schema({
  gameType: {
    type: String,
    enum: ["tic-tac-toe", "rock-paper-scissors"],
    required: true,
  },
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  gameData: {
    type: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ["waiting", "in-progress", "completed"],
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const GameSession =
  mongoose.models.GameSession ||
  mongoose.model("GameSession", GameSessionSchema);
