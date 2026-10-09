"use client";

export default function UpgradePage() {
  const features = [
    "Unlimited courses",
    "AI course generation",
    "Unlimited chapters",
    "YouTube resources",
    "Progress tracking",
    "Personalized learning paths",
    "Full dashboard access",
    "Explore courses",
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Upgrade Your Plan
          </h1>

          <p className="mt-3 text-gray-500">
            Get full access to all AI Course Builder features.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Free Plan */}
          <div className="rounded-2xl border-2 border-purple-600 bg-white p-8 shadow-lg">
            <div className="mb-4 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
              Full Access
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Free
            </h2>

            <p className="mt-3 text-gray-500">
              Everything you need to create and learn AI-powered courses.
            </p>

            <div className="my-6 text-4xl font-bold text-slate-900">
              $0
              <span className="text-base font-normal text-gray-500">
                /month
              </span>
            </div>

            <ul className="space-y-3 text-gray-600">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="font-semibold text-green-600">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              disabled
              className="mt-8 w-full rounded-lg bg-gray-100 px-5 py-3 font-medium text-gray-500"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-4 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
              Pro
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Pro
            </h2>

            <p className="mt-3 text-gray-500">
              The same complete AI Course Builder experience.
            </p>

            <div className="my-6 text-4xl font-bold text-slate-900">
              $9.99
              <span className="text-base font-normal text-gray-500">
                /month
              </span>
            </div>

            <ul className="space-y-3 text-gray-600">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="font-semibold text-green-600">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => alert("Payment integration coming soon!")}
              className="mt-8 w-full rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Upgrade to Pro
            </button>
          </div>

        </div>

        {/* Bottom Message */}
        <div className="mt-8 rounded-xl border border-purple-200 bg-purple-50 p-5 text-center">
          <p className="text-sm text-purple-800">
            All users get full access to AI Course Builder features.
            Pro is available as an optional upgrade.
          </p>
        </div>

      </div>
    </div>
  );
}