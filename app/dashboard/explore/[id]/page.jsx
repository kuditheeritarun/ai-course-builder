import { db } from "../../../db";
import { courses } from "../../../db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function ExploreCourseDetailsPage({ params }) {
  const { id } = await params;

  const courseResult = await db
    .select()
    .from(courses)
    .where(eq(courses.id, Number(id)))
    .limit(1);

  const course = courseResult[0];

  if (!course) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Course Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          This course does not exist.
        </p>

        <Link
          href="/dashboard/explore"
          className="mt-6 inline-flex rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-700"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const chapters = Array.isArray(course.chapters)
    ? course.chapters
    : [];

  return (
    <div className="p-6 md:p-8">
      {/* Back Button */}
      <Link
        href="/dashboard/explore"
        className="mb-6 inline-flex text-sm font-medium text-purple-600 hover:text-purple-700"
      >
        ← Back to Explore
      </Link>

      {/* Course Header */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-medium text-purple-600">
          {course.category}
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
          {course.courseTitle}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {course.courseDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
            {course.difficulty}
          </span>

          <span className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700">
            {course.duration}
          </span>

          <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
            {chapters.length} Chapters
          </span>
        </div>
      </div>

      {/* Chapters */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900">
          Course Chapters
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Explore the topics included in this course.
        </p>

        <div className="mt-5 space-y-4">
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {chapter.chapterTitle}
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-gray-500">
                    {chapter.chapterDescription}
                  </p>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Topics
                    </h4>

                    <ul className="mt-2 space-y-2">
                      {chapter.topics?.map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <span className="mt-1 text-purple-600">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
