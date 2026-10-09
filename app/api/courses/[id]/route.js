import { auth } from "@clerk/nextjs/server";
import { db } from "../../../db";
import { courses } from "../../../db/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const courseId = Number(id);

    if (!courseId) {
      return Response.json(
        { error: "Invalid course ID" },
        { status: 400 }
      );
    }

    const deletedCourse = await db
      .delete(courses)
      .where(
        and(
          eq(courses.id, courseId),
          eq(courses.userId, userId)
        )
      )
      .returning();

    if (deletedCourse.length === 0) {
      return Response.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return Response.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}