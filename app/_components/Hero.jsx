"use client";

import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">

          <h1 className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
            AI Course Generator
          </h1>

          <h2 className="mt-2 text-5xl font-bold leading-tight text-purple-600 md:text-6xl">
            Custom Learning Paths,
            <br />
            Powered by AI
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-700">
            Unlock personalized education with AI-driven course creation.
            Tailor your learning journey to fit your unique goals and pace.
          </p>

          {/* Get Started */}
          <div className="mt-10">

            {/* Signed Out */}
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="rounded-md bg-red-600 px-7 py-4 text-base font-medium text-white shadow-md transition hover:bg-red-700"
                >
                  Get Started
                </button>
              </SignUpButton>
            </Show>

            {/* Signed In */}
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="inline-block rounded-md bg-red-600 px-7 py-4 text-base font-medium text-white shadow-md transition hover:bg-red-700"
              >
                Get Started
              </Link>
            </Show>

          </div>

        </div>
      </section>

      {/* Learn More section */}
      <section
        id="learn-more"
        className="scroll-mt-20 border-t border-gray-100 bg-gray-50 px-6 py-24"
      >
        <div className="mx-auto max-w-5xl text-center">

          <h2 className="text-4xl font-bold text-slate-900">
            Learn More
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            AI Course Builder helps you create personalized learning paths
            based on your goals, interests, skill level, and learning pace.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">
                AI Generated Courses
              </h3>

              <p className="mt-3 text-gray-600">
                Generate structured courses designed around your learning
                goals.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">
                Personalized Learning
              </h3>

              <p className="mt-3 text-gray-600">
                Learn at your own pace with content tailored to your needs.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">
                Smart Learning Paths
              </h3>

              <p className="mt-3 text-gray-600">
                Follow a clear learning path from beginner concepts to
                practical skills.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}