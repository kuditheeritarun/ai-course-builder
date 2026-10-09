import { auth } from "@clerk/nextjs/server";
import { db } from "../../../../../db";
import { courses } from "../../../../../db/schema";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import ChapterCompleteButton from "../../ChapterCompleteButton";

export default async function ChapterPage({ params }) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Please sign in
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            You need to be signed in to view this chapter.
          </p>
        </div>
      </div>
    );
  }

  const { id, chapterId } = await params;
  const courseId = Number(id);
  const chapterIndex = Number(chapterId);

  if (
    !Number.isInteger(courseId) ||
    !Number.isInteger(chapterIndex) ||
    chapterIndex < 0
  ) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Invalid Chapter
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            The course or chapter URL is invalid.
          </p>
          <Link
            href="/dashboard/courses"
            className="mt-6 inline-flex rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
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
            className="mt-6 inline-flex rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
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

  const chapter = chapters[chapterIndex];

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Chapter Not Found
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            The requested chapter does not exist in this course.
          </p>
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="mt-6 inline-flex rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const completedChapters = Array.isArray(course.completedChapters)
    ? course.completedChapters
    : [];

  const isCompleted = completedChapters.includes(chapterIndex);

  const previousChapter =
    chapterIndex > 0 ? chapterIndex - 1 : null;

  const nextChapter =
    chapterIndex < chapters.length - 1
      ? chapterIndex + 1
      : null;

  const topics = Array.isArray(chapter.topics)
    ? chapter.topics
    : [];

  // YouTube videos: search with fallback queries.
  let youtubeVideos = [];
  let youtubeError = "";

  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  if (!youtubeApiKey) {
    youtubeError =
      "YOUTUBE_API_KEY is missing from .env.local";
  } else {
    const searchQueries = [
      `${chapter.chapterTitle} ${course.courseTitle}`,
      `${chapter.chapterTitle} tutorial`,
      `${chapter.chapterTitle} explained`,
      ...topics.slice(0, 3).map(
        (topic) => `${topic} tutorial`
      ),
      `${course.courseTitle} tutorial`,
    ]
      .map((query) => query.trim())
      .filter(Boolean)
      .filter(
        (query, index, queries) =>
          queries.indexOf(query) === index
      );

    try {
      for (const searchQuery of searchQueries) {
        const youtubeUrl = new URL(
          "https://www.googleapis.com/youtube/v3/search"
        );

        youtubeUrl.searchParams.set("part", "snippet");
        youtubeUrl.searchParams.set("q", searchQuery);
        youtubeUrl.searchParams.set("type", "video");
        youtubeUrl.searchParams.set("maxResults", "5");
        youtubeUrl.searchParams.set("order", "relevance");
        youtubeUrl.searchParams.set("key", youtubeApiKey);

        const youtubeResponse = await fetch(
          youtubeUrl.toString(),
          { cache: "no-store" }
        );

        const youtubeData = await youtubeResponse.json();

        if (!youtubeResponse.ok) {
          console.error(
            "YouTube API Error:",
            youtubeData
          );

          youtubeError =
            youtubeData?.error?.message ||
            "Unable to load YouTube videos.";

          // Stop if the API key, quota, or request is invalid.
          break;
        }

        const videos = (youtubeData.items || [])
          .filter((item) => item.id?.videoId)
          .map((item) => ({
            videoId: item.id.videoId,
            title: item.snippet?.title || "YouTube video",
            description: item.snippet?.description || "",
            thumbnail:
              item.snippet?.thumbnails?.medium?.url ||
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.default?.url ||
              "",
            channelTitle:
              item.snippet?.channelTitle || "YouTube",
          }));

        if (videos.length > 0) {
          youtubeVideos = videos;
          youtubeError = "";
          break;
        }
      }

      if (
        youtubeVideos.length === 0 &&
        !youtubeError
      ) {
        youtubeError =
          "No matching videos were returned. Try checking the chapter title or topics.";
      }
    } catch (error) {
      console.error("YouTube fetch error:", error);

      youtubeError =
        error.message ||
        "Unable to load YouTube videos.";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/dashboard/courses/${course.id}`}
          className="mb-6 inline-flex items-center text-sm font-medium text-purple-600 transition hover:text-purple-700"
        >
          ← Back to Course
        </Link>

        {/* Chapter Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-4">
            <div
              className={
                isCompleted
                  ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600"
                  : "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600"
              }
            >
              {isCompleted ? "✓" : chapterIndex + 1}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-purple-600">
                {course.courseTitle}
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                {chapter.chapterTitle}
              </h1>

              {chapter.chapterDescription && (
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {chapter.chapterDescription}
                </p>
              )}

              {isCompleted && (
                <div className="mt-4 inline-flex items-center rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                  ✓ You have completed this chapter
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What You Will Learn */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            What You Will Learn
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Topics covered in this chapter.
          </p>

          {topics.length > 0 ? (
            <div className="mt-5 space-y-3">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm font-medium text-gray-700">
                    {topic}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
              No topics are available for this chapter.
            </div>
          )}
        </div>

        {/* Chapter Overview */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            Chapter Overview
          </h2>

          <div className="mt-5 rounded-xl bg-purple-50 p-5">
            <p className="text-sm leading-7 text-purple-900">
              In this chapter, you will learn about{" "}
              <strong>{chapter.chapterTitle}</strong>. Work through
              each topic carefully and practice what you learn before
              moving to the next topic.
            </p>
          </div>

          {topics.length > 0 && (
            <div className="mt-6 space-y-5">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-5 last:border-b-0"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {index + 1}. {topic}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Study this topic carefully and practice what you
                    learn before moving to the next topic.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended YouTube Videos */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            📺 Recommended YouTube Videos
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Helpful videos related to this chapter.
          </p>

          {youtubeError ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
              <h3 className="font-semibold text-red-800">
                Unable to load YouTube videos
              </h3>
              <p className="mt-2 text-sm text-red-600">
                {youtubeError}
              </p>
            </div>
          ) : youtubeVideos.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {youtubeVideos.map((video) => (
                <a
                  key={video.videoId}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-purple-300 hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    {video.thumbnail && (
                      <Image
                        src={video.thumbnail}
                        alt={video.title || "YouTube video"}
                        width={640}
                        height={360}
                        unoptimized
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-purple-600">
                      {video.title}
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                      {video.channelTitle || "YouTube"}
                    </p>
                    <div className="mt-3 inline-flex items-center rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                      ▶ Watch on YouTube
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
              No YouTube videos were found for this chapter.
            </div>
          )}
        </div>

        {/* Chapter Progress */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Chapter Progress
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Complete this chapter when you have finished learning
                all the topics.
              </p>
            </div>

            <ChapterCompleteButton
              courseId={course.id}
              chapterIndex={chapterIndex}
              completed={isCompleted}
            />
          </div>
        </div>

        {/* Chapter Navigation */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
          {previousChapter !== null ? (
            <Link
              href={`/dashboard/courses/${course.id}/chapter/${previousChapter}`}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ← Previous Chapter
            </Link>
          ) : (
            <div />
          )}

          {nextChapter !== null ? (
            <Link
              href={`/dashboard/courses/${course.id}/chapter/${nextChapter}`}
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
            >
              Next Chapter →
            </Link>
          ) : (
            <Link
              href={`/dashboard/courses/${course.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Finish Course ✓
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}