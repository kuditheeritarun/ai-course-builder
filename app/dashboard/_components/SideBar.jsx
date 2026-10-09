"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

import {
  FiHome,
  FiCompass,
  FiStar,
  FiLogOut,
} from "react-icons/fi";

const Menu = [
  {
    name: "Home",
    icon: <FiHome />,
    path: "/dashboard",
  },
  {
    name: "Explore",
    icon: <FiCompass />,
    path: "/dashboard/explore",
  },
  {
    name: "Upgrade",
    icon: <FiStar />,
    path: "/dashboard/upgrade",
  },
];

export default function SideBar() {
  const path = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 border-r bg-white md:block">
      
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-xl shadow-md">
          🎓
        </div>

        <h1 className="text-lg font-bold text-slate-900">
          AI Course Builder
        </h1>
      </div>

      {/* Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {Menu.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  path === item.path
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-xl">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-6 w-64 px-4">

        {/* Course Usage */}
        <div className="rounded-xl bg-gray-50 p-4">

          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Course Usage
            </span>

            <span className="text-sm text-gray-600">
              5 / 5
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
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
            className="mt-5 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </SignOutButton>

      </div>
    </aside>
  );
}