import { db } from "../../db";
import { courses } from "../../db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function ExplorePage() {
  // Get all courses from the database
  const allCourses = await db
    .select()
    .from(courses)
    .orderBy(desc(courses.id));

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Explore Courses
            </h1>

            <p className="mt-2 text-gray-500">
              Discover AI-generated courses and explore new topics.
            </p>
          </div>

          {/* Course Count */}
          <div className="rounded-xl bg-purple-50 px-4 py-3">
            <p className="text-sm text-purple-600">
              Available Courses
            </p>

            <p className="text-2xl font-bold text-purple-700">
              {allCourses.length}
            </p>
          </div>
        </div>
      </div>

      {/* No Courses */}
      {allCourses.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <span className="text-2xl">📚</span>
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            No courses available yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            There are no AI-generated courses available right now.
            Create your first course and start learning.
          </p>

          <Link
            href="/dashboard/create"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
          >
            + Create Your First Course
          </Link>
        </div>
      ) : (
        <>
          {/* Section Heading */}
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              All Courses
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose a course and explore its learning chapters.
            </p>
          </div>

          {/* Course Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {allCourses.map((course) => {
              const chapters = Array.isArray(course.chapters)
                ? course.chapters
                : [];

              return (
                <div
                  key={course.id}
                  className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
                >
                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {course.category}
                    </span>

                    <span className="text-xs text-gray-400">
                      Course #{course.id}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 line-clamp-2 text-xl font-semibold text-slate-900">
                    {course.courseTitle}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                    {course.courseDescription}
                  </p>

                  {/* Course Information */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                      {course.difficulty}
                    </span>

                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                      {course.duration}
                    </span>

                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                      {chapters.length} Chapters
                    </span>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* View Course */}
                  <Link
                    href={`/dashboard/explore/${course.id}`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
                  >
                    View Course →
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
