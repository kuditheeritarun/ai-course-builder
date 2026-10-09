"use client";

import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="flex h-20 items-center justify-between px-6 md:px-10">

        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-purple-600 shadow-md">
            <svg
              width="30"
              height="30"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 6L4 16L24 26L44 16L24 6Z"
                fill="white"
              />

              <path
                d="M10 22V34C10 36 12 38 14 39L24 44L34 39C36 38 38 36 38 34V22L24 29L10 22Z"
                fill="white"
                fillOpacity="0.9"
              />

              <circle
                cx="24"
                cy="20"
                r="3"
                fill="#7C3AED"
              />

              <path
                d="M24 23V27M21 20H18M27 20H30"
                stroke="#7C3AED"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span className="text-2xl font-bold text-slate-900">
            AI Course Builder
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3">

          {/* Signed Out */}
          <Show when="signed-out">

            {/* Learn More */}
            <a
              href="#learn-more"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Learn More
            </a>

            {/* Sign In */}
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Sign In
              </button>
            </SignInButton>

            {/* Get Started */}
            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
              >
                Get Started
              </button>
            </SignUpButton>

          </Show>

          {/* Signed In */}
          <Show when="signed-in">

            {/* Go to Dashboard */}
            <Link
              href="/dashboard"
              className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
            >
              Get Started
            </Link>

            {/* User */}
            <UserButton />

          </Show>

        </div>
      </div>
    </header>
  );
}