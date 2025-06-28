"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center min-h-screen text-center">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-indigo-600">GameHub</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Play classic games like Tic-Tac-Toe and Rock-Paper-Scissors with
              friends online. Create an account to track your stats and compete!
            </p>

            {/* Game Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Tic-Tac-Toe</h3>
                <p className="text-gray-600">
                  Classic 3x3 grid game. Play against friends or AI.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl mb-4">✂️</div>
                <h3 className="text-xl font-semibold mb-2">
                  Rock Paper Scissors
                </h3>
                <p className="text-gray-600">
                  The timeless hand game with score tracking.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Why Choose GameHub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-4">🎮</div>
                <h3 className="text-lg font-semibold mb-2">Multiple Games</h3>
                <p className="text-gray-600">
                  Growing collection of classic games
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Track Stats</h3>
                <p className="text-gray-600">
                  Monitor your progress and win rates
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your data is safe with us</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
