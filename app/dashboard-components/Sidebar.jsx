"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCompass,
  FiStar,
  FiLogOut,
} from "react-icons/fi";
import { SignOutButton } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: FiHome,
    },
    {
      name: "Explore",
      href: "/dashboard/explore",
      icon: FiCompass,
    },
    {
      name: "Upgrade",
      href: "/dashboard/upgrade",
      icon: FiStar,
    },
  ];

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-gray-200 bg-white px-5 py-6">

      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-10 flex items-center gap-3 px-1"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-sm">
          <span className="text-2xl">🎓</span>
        </div>

        <span className="text-xl font-bold text-slate-900">
          AI Course Builder
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                active
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={21} strokeWidth={2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto">

        {/* Course Usage */}
        <div className="mb-6 rounded-xl bg-gray-50 p-4">

          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Course Usage
            </span>

            <span className="text-sm text-gray-500">
              5 / 5
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-full rounded-full bg-purple-600" />
          </div>

          <p className="mt-3 text-xs leading-5 text-gray-500">
            Upgrade your plan for unlimited courses.
          </p>
        </div>

        {/* Logout */}
        <SignOutButton>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </SignOutButton>

      </div>
    </aside>
  );
}