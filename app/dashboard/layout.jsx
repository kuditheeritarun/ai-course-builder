"use client";

import { useState } from "react";
import Sidebar from "../dashboard-components/Sidebar";
import { UserButton } from "@clerk/nextjs";
import { UserInputContext } from "../_context/UserInputContext";

export default function DashboardLayout({ children }) {
  const [userCourseInput, setUserCourseInput] = useState([]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b bg-white px-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Dashboard
          </h2>

          <UserButton />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <UserInputContext.Provider
            value={{
              userCourseInput,
              setUserCourseInput,
            }}
          >
            {children}
          </UserInputContext.Provider>
        </main>

      </div>

    </div>
  );
}