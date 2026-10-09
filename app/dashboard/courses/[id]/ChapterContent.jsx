"use client";

import { useState } from "react";

export default function ChapterContent({
  courseTitle,
  chapterTitle,
  chapterDescription,
  topics,
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");

  const generateContent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/generate-chapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseTitle,
          chapterTitle,
          chapterDescription,
          topics,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate chapter content"
        );
      }

      setContent(data.content);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Something went wrong while generating content."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Chapter Learning Content
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Generate detailed AI-powered content for this chapter.
          </p>
        </div>

        <button
          type="button"
          onClick={generateContent}
          disabled={loading}
          className="rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {content && (
        <div className="mt-6 rounded-xl bg-gray-50 p-5">
          <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {typeof content === "string"
              ? content
              : JSON.stringify(content, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
}   