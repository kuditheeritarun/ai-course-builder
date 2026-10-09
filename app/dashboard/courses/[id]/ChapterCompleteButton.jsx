"use client";

import { useState } from "react";

export default function ChapterCompleteButton({
  courseId,
  chapterIndex,
  completed,
}) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [loading, setLoading] = useState(false);

  const markComplete = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/courses/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          chapterIndex,
        }),
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Unexpected server response (${response.status}). Please check the API route.`
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to update progress."
        );
      }

      setIsCompleted(true);
    } catch (error) {
      console.error("Chapter completion error:", error);

      alert(
        error.message ||
          "Something went wrong while updating progress."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={markComplete}
      disabled={isCompleted || loading}
      className={
        isCompleted
          ? "rounded-lg bg-green-100 px-5 py-3 font-medium text-green-700"
          : "rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      }
    >
      {isCompleted
        ? "Chapter Completed ✓"
        : loading
        ? "Saving..."
        : "Mark Chapter Complete"}
    </button>
  );
}
