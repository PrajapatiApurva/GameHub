import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/lib/mongodb";
import { User, GameSession } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gameType, result, gameData } = await request.json();

    if (!gameType || !result) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create game session record
    const gameSession = new GameSession({
      gameType,
      player1: session.user.id,
      winner: result === "win" ? session.user.id : null,
      gameData,
      status: "completed",
      completedAt: new Date(),
    });

    await gameSession.save();

    // Update user statistics
    const updateData = {
      $inc: { gamesPlayed: 1, ...(result === "win" ? { gamesWon: 1 } : {}) },
    };

    await User.findByIdAndUpdate(session.user.id, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording game result:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
