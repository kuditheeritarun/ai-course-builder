import { auth } from "@clerk/nextjs/server";
import { db } from "../../../db";
import { courses } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import Link from "next/link";

export default async function CoursePage({ params }) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Please sign in
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            You need to be signed in to view this course.
          </p>
        </div>
      </div>
    );
  }

  const { id } = await params;

  const courseId = Number(id);

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Invalid Course
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The course URL is invalid.
          </p>

          <Link
            href="/dashboard/courses"
            className="mt-6 inline-flex rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-700"
          >
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const courseResult = await db
    .select()
    .from(courses)
    .where(
      and(
        eq(courses.id, courseId),
        eq(courses.userId, userId)
      )
    )
    .limit(1);

  const course = courseResult[0];

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Course Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This course does not exist or you do not have access to it.
          </p>

          <Link
            href="/dashboard/courses"
            className="mt-6 inline-flex rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-700"
          >
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const chapters = Array.isArray(course.chapters)
    ? course.chapters
    : [];

  const completedChapters = Array.isArray(course.completedChapters)
    ? course.completedChapters
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/dashboard/courses"
          className="mb-6 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          ← Back to My Courses
        </Link>

        {/* Course Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-medium text-purple-600">
            {course.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {course.courseTitle}
          </h1>

          {course.description && (
            <p className="mt-4 leading-7 text-gray-500">
              {course.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {course.difficulty && (
              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                {course.difficulty}
              </span>
            )}

            {course.duration && (
              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                {course.duration}
              </span>
            )}

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              {completedChapters.length}/{chapters.length} Completed
            </span>
          </div>
        </div>

        {/* Chapters */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold text-slate-900">
            Course Chapters
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select a chapter to start learning.
          </p>

          <div className="mt-6 space-y-4">
            {chapters.length > 0 ? (
              chapters.map((chapter, index) => {
                const isCompleted = completedChapters.includes(index);

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 transition hover:border-purple-300 hover:bg-purple-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">

                      <div
                        className={
                          isCompleted
                            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-600"
                            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600"
                        }
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {chapter.chapterTitle}
                        </h3>

                        {chapter.chapterDescription && (
                          <p className="mt-1 text-sm text-gray-500">
                            {chapter.chapterDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/courses/${course.id}/chapter/${index}`}
                      className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-700"
                    >
                      {isCompleted ? "Review Chapter" : "View Chapter"}
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
                No chapters available for this course.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
} 