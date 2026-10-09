import { auth } from "@clerk/nextjs/server";
import { db } from "../../../db/index.js";
import { courses } from "../../../db/schema.js";
import { and, eq } from "drizzle-orm";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const { courseId, chapterIndex } = await request.json();

    const numericCourseId = Number(courseId);
    const numericChapterIndex = Number(chapterIndex);

    if (
      courseId === undefined ||
      courseId === null ||
      !Number.isInteger(numericCourseId) ||
      !Number.isInteger(numericChapterIndex) ||
      numericChapterIndex < 0
    ) {
      return Response.json(
        {
          success: false,
          error: "Valid courseId and chapterIndex are required.",
        },
        { status: 400 }
      );
    }

    // Find the course belonging to the logged-in user.
    const courseResult = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.id, numericCourseId),
          eq(courses.userId, userId)
        )
      )
      .limit(1);

    const course = courseResult[0];

    if (!course) {
      return Response.json(
        {
          success: false,
          error: "Course not found.",
        },
        { status: 404 }
      );
    }

    // Get existing completed chapters without duplicates.
    const completedChapters = Array.isArray(course.completedChapters)
      ? [...new Set(course.completedChapters.map(Number))]
      : [];

    // Add this chapter if it isn't already completed.
    if (!completedChapters.includes(numericChapterIndex)) {
      completedChapters.push(numericChapterIndex);
    }

    // Save the updated progress.
    const updatedCourse = await db
      .update(courses)
      .set({
        completedChapters,
      })
      .where(
        and(
          eq(courses.id, numericCourseId),
          eq(courses.userId, userId)
        )
      )
      .returning();

    return Response.json({
      success: true,
      completedChapters:
        updatedCourse[0]?.completedChapters ?? completedChapters,
    });
  } catch (error) {
    console.error("Complete Chapter Error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to complete chapter. Check the terminal for details.",
      },
      { status: 500 }
    );
  }
}