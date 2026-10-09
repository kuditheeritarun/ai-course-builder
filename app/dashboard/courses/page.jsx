import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { courses } from "../../db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import DeleteCourseButton from "./DeleteCourseButton";

export default async function CoursesPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Please sign in
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          You need to be signed in to view your courses.
        </p>
      </div>
    );
  }

  const allCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.userId, userId));

  return (
    <div className="p-6 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          My Courses
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View all the courses you have generated.
        </p>
      </div>

      {/* Courses */}
      {allCourses.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            No courses yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Create your first AI course to see it here.
          </p>

          <Link
            href="/dashboard/create"
            className="mt-5 inline-flex rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
          >
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {allCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Course Content */}
              <Link
                href={`/dashboard/courses/${course.id}`}
                className="block"
              >
                {/* Course Title */}
                <h2 className="text-lg font-semibold text-slate-900">
                  {course.courseTitle}
                </h2>

                {/* Description */}
                <p className="mt-3 text-sm leading-5 text-gray-500">
                  {course.courseDescription}
                </p>

                {/* Course Information */}
                <div className="mt-5 space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Category:</strong> {course.category}
                  </p>

                  <p>
                    <strong>Topic:</strong> {course.topic}
                  </p>

                  <p>
                    <strong>Difficulty:</strong> {course.difficulty}
                  </p>

                  <p>
                    <strong>Duration:</strong> {course.duration}
                  </p>
                </div>

                {/* Chapters */}
                <div className="mt-5">
                  <span className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                    {course.chapters?.length || 0} Chapters
                  </span>
                </div>
              </Link>

              {/* Bottom Buttons */}
              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <Link
                  href={`/dashboard/courses/${course.id}`}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  View Course →
                </Link>

                <DeleteCourseButton courseId={course.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}