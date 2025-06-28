"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Player = "X" | "O" | null;
type Board = Player[];

export default function TicTacToe() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [gameMode, setGameMode] = useState<"human" | "computer">("human");

  const recordGameResult = useCallback(
    async (result: "win" | "lose" | "draw") => {
      try {
        await fetch("/api/games/result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameType: "tic-tac-toe",
            result,
            gameData: {
              board,
              gameMode,
              playerSymbol: "X",
            },
          }),
        });
      } catch (error) {
        console.error("Error recording game result:", error);
      }
    },
    [board, gameMode]
  );

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  const calculateWinner = (squares: Board): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = useCallback(
    (index: number) => {
      if (board[index] || winner) return;

      const newBoard = board.slice();
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);
      setIsXNext(!isXNext);
    },
    [board, isXNext, winner]
  );

  useEffect(() => {
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      // Record game result
      if (gameMode === "computer") {
        if (gameWinner === "X") {
          recordGameResult("win");
        } else {
          recordGameResult("lose");
        }
      } else {
        // For human vs human, consider X as the user
        recordGameResult(gameWinner === "X" ? "win" : "lose");
      }
    } else if (board.every((square) => square !== null)) {
      setWinner("Draw");
      recordGameResult("draw");
    }
  }, [board, gameMode, recordGameResult]);

  useEffect(() => {
    if (gameMode === "computer" && !isXNext && !winner) {
      const timer = setTimeout(() => {
        const availableSquares = board
          .map((square, index) => (square === null ? index : null))
          .filter((val) => val !== null);

        if (availableSquares.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * availableSquares.length
          );
          const computerMove = availableSquares[randomIndex];
          handleClick(computerMove!);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, winner, board, handleClick]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderSquare = (index: number) => {
    return (
      <button
        key={index}
        className="w-16 h-16 bg-white border-2 border-gray-300 text-2xl font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
        onClick={() => handleClick(index)}
        disabled={board[index] !== null || winner !== null}
      >
        {board[index]}
      </button>
    );
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tic-Tac-Toe</h1>
          <p className="text-gray-600">Classic 3x3 grid game</p>
        </div>

        {/* Game Mode Selection */}
        <div className="text-center mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => {
                setGameMode("human");
                resetGame();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                gameMode === "human"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              vs Human
            </button>
            <button
              onClick={() => {
                setGameMode("computer");
                resetGame();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                gameMode === "computer"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              vs Computer
            </button>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          {winner ? (
            <div className="text-xl font-semibold">
              {winner === "Draw" ? (
                <span className="text-yellow-600">It&apos;s a draw!</span>
              ) : (
                <span className="text-green-600">Player {winner} wins! 🎉</span>
              )}
            </div>
          ) : (
            <div className="text-lg">
              Current player:{" "}
              <span className="font-semibold">
                Player {isXNext ? "X" : "O"}
              </span>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-3 gap-1 bg-gray-400 p-1 rounded-lg">
            {Array(9)
              .fill(null)
              .map((_, index) => renderSquare(index))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
