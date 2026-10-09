import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600">

        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl" />

        <div className="relative z-10 flex min-h-screen flex-col p-12 text-white">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              🎓
            </div>

            <span className="text-2xl font-bold">
              AI Course Builder
            </span>
          </div>

          {/* Bottom content */}
          <div className="mt-auto max-w-xl pb-10">

            <h1 className="text-5xl font-bold leading-tight">
              Build your learning
              <br />
              journey with AI.
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/80">
              Create personalized courses and discover the right
              learning resources with AI-powered education.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm">
                ✨ AI Powered
              </span>

              <span className="rounded-full bg-white/15 px-4 py-2 text-sm">
                📚 Personalized Learning
              </span>

              <span className="rounded-full bg-white/15 px-4 py-2 text-sm">
                🚀 Learn Faster
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600">
              🎓
            </div>

            <span className="text-xl font-bold">
              AI Course Builder
            </span>
          </div>

          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-xl border border-gray-200 rounded-2xl",
              },
              variables: {
                colorPrimary: "#7c3aed",
                colorText: "#111827",
                colorTextSecondary: "#6b7280",
                borderRadius: "12px",
              },
            }}
          />

        </div>
      </div>

    </div>
  );
}