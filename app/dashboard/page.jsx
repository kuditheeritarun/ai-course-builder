import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "../db";
import { courses } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import {
  FiPlus,
  FiBookOpen,
  FiCompass,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  const firstName = user?.firstName || "User";

  if (!userId) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Please sign in
        </h1>

        <p className="mt-2 text-gray-500">
          You need to sign in to view your dashboard.
        </p>
      </div>
    );
  }

  const userCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.userId, userId))
    .orderBy(desc(courses.id));

  const totalCourses = userCourses.length;

  let totalChapters = 0;
  let completedChapters = 0;

  userCourses.forEach((course) => {
    const chapters = Array.isArray(course.chapters)
      ? course.chapters
      : [];

    const completed = Array.isArray(course.completedChapters)
      ? course.completedChapters
      : [];

    totalChapters += chapters.length;
    completedChapters += completed.length;
  });

  const overallProgress =
    totalChapters > 0
      ? Math.round(
          (completedChapters / totalChapters) * 100
        )
      : 0;

  const recentCourses = userCourses.slice(0, 3);

  return (
    <div className="p-6 md:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Hello, {firstName} 👋
        </h1>

        <p className="mt-2 text-gray-500">
          Continue your learning journey and create new AI-powered courses.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Courses */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Courses
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalCourses}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <FiBookOpen className="text-xl text-purple-600" />
            </div>
          </div>
        </div>

        {/* Completed Chapters */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Chapters Completed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {completedChapters}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                of {totalChapters} total chapters
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <FiCheckCircle className="text-xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Overall Progress
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {overallProgress}%
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <FiTrendingUp className="text-xl text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Create Course */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
            <FiPlus className="text-xl text-purple-600" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900">
            Create New Course
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Generate a personalized learning course using AI.
          </p>

          <Link
            href="/dashboard/create"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
          >
            <FiPlus />
            Create Course
          </Link>
        </div>

        {/* My Courses */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <FiBookOpen className="text-xl text-blue-600" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900">
            My Courses
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            View and continue learning from your existing courses.
          </p>

          <Link
            href="/dashboard/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FiBookOpen />
            View Courses
          </Link>
        </div>

        {/* Explore */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <FiCompass className="text-xl text-green-600" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900">
            Explore Courses
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Discover new topics and continue expanding your knowledge.
          </p>

          <Link
            href="/dashboard/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FiCompass />
            Explore
          </Link>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Learning Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {completedChapters} of {totalChapters} chapters completed
            </p>
          </div>

          <span className="text-3xl font-bold text-purple-600">
            {overallProgress}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-purple-600 transition-all duration-500"
            style={{
              width: `${overallProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Recent Courses */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recent Courses
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Continue where you left off.
            </p>
          </div>

          {totalCourses > 0 && (
            <Link
              href="/dashboard/courses"
              className="text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              View All →
            </Link>
          )}
        </div>

        {recentCourses.length === 0 ? (
          <div className="mt-5 rounded-2xl border bg-white p-8 text-center shadow-sm">
            <FiBookOpen className="mx-auto text-4xl text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No courses yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Create your first AI-powered course and start learning.
            </p>

            <Link
              href="/dashboard/create"
              className="mt-5 inline-flex rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-700"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recentCourses.map((course) => {
              const chapters = Array.isArray(course.chapters)
                ? course.chapters
                : [];

              const completed = Array.isArray(
                course.completedChapters
              )
                ? course.completedChapters
                : [];

              const courseProgress =
                chapters.length > 0
                  ? Math.round(
                      (completed.length / chapters.length) * 100
                    )
                  : 0;

              return (
                <Link
                  key={course.id}
                  href={`/dashboard/courses/${course.id}`}
                  className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-sm font-medium text-purple-600">
                    {course.category}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {course.courseTitle}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {course.courseDescription}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {completed.length} / {chapters.length} chapters
                    </span>

                    <span className="font-semibold text-purple-600">
                      {courseProgress}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-purple-600"
                      style={{
                        width: `${courseProgress}%`,
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}