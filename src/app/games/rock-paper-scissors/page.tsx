"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Choice = "rock" | "paper" | "scissors" | null;
type GameResult = "win" | "lose" | "draw" | null;

export default function RockPaperScissors() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  const recordGameResult = useCallback(
    async (gameResult: GameResult, pChoice: Choice, cChoice: Choice) => {
      if (!gameResult) return;

      try {
        await fetch("/api/games/result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameType: "rock-paper-scissors",
            result: gameResult,
            gameData: {
              playerChoice: pChoice,
              computerChoice: cChoice,
              result: gameResult,
            },
          }),
        });
      } catch (error) {
        console.error("Error recording game result:", error);
      }
    },
    []
  );

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  const choices: { value: Choice; emoji: string; name: string }[] = [
    { value: "rock", emoji: "🪨", name: "Rock" },
    { value: "paper", emoji: "📄", name: "Paper" },
    { value: "scissors", emoji: "✂️", name: "Scissors" },
  ];

  const getRandomChoice = (): Choice => {
    const validChoices: Choice[] = ["rock", "paper", "scissors"];
    return validChoices[Math.floor(Math.random() * validChoices.length)];
  };

  const determineWinner = (player: Choice, computer: Choice): GameResult => {
    if (player === computer) return "draw";

    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win";
    }

    return "lose";
  };

  const playGame = async (choice: Choice) => {
    if (isPlaying) return;

    setIsPlaying(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult(null);

    // Simulate computer thinking
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const compChoice = getRandomChoice();
    setComputerChoice(compChoice);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const gameResult = determineWinner(choice, compChoice);
    setResult(gameResult);

    // Record the game result
    await recordGameResult(gameResult, choice, compChoice);

    // Update score
    setScore((prev) => ({
      ...prev,
      player: gameResult === "win" ? prev.player + 1 : prev.player,
      computer: gameResult === "lose" ? prev.computer + 1 : prev.computer,
      draws: gameResult === "draw" ? prev.draws + 1 : prev.draws,
    }));

    setIsPlaying(false);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({ player: 0, computer: 0, draws: 0 });
    setIsPlaying(false);
  };

  const getChoiceDisplay = (choice: Choice) => {
    if (!choice) return { emoji: "❓", name: "Thinking..." };
    const choiceObj = choices.find((c) => c.value === choice);
    return choiceObj || { emoji: "❓", name: "Unknown" };
  };

  const getResultMessage = () => {
    if (!result) return "";
    switch (result) {
      case "win":
        return "You Win! 🎉";
      case "lose":
        return "Computer Wins! 🤖";
      case "draw":
        return "It's a Draw! 🤝";
      default:
        return "";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rock Paper Scissors
          </h1>
          <p className="text-gray-600">The classic hand game</p>
        </div>

        {/* Score */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {score.player}
              </div>
              <div className="text-sm text-gray-500">You</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {score.draws}
              </div>
              <div className="text-sm text-gray-500">Draws</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {score.computer}
              </div>
              <div className="text-sm text-gray-500">Computer</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Player */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">You</h3>
              <div className="text-6xl mb-2">
                {getChoiceDisplay(playerChoice).emoji}
              </div>
              <div className="text-sm text-gray-600">
                {getChoiceDisplay(playerChoice).name}
              </div>
            </div>

            {/* Computer */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Computer</h3>
              <div className="text-6xl mb-2">
                {isPlaying && !computerChoice
                  ? "🤔"
                  : getChoiceDisplay(computerChoice).emoji}
              </div>
              <div className="text-sm text-gray-600">
                {isPlaying && !computerChoice
                  ? "Thinking..."
                  : getChoiceDisplay(computerChoice).name}
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="text-center mb-6">
              <div
                className={`text-xl font-bold ${
                  result === "win"
                    ? "text-green-600"
                    : result === "lose"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {getResultMessage()}
              </div>
            </div>
          )}

          {/* Choices */}
          <div className="grid grid-cols-3 gap-4">
            {choices.map((choice) => (
              <button
                key={choice.value}
                onClick={() => playGame(choice.value)}
                disabled={isPlaying}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  playerChoice === choice.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-4xl mb-2">{choice.emoji}</div>
                <div className="font-medium">{choice.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Reset Score
          </button>
        </div>
      </div>
    </div>
  );
}
