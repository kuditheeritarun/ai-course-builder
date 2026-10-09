import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { courses } from "../../db/schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    // Get the currently logged-in Clerk user
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        {
          success: false,
          error: "You must be logged in to create a course.",
        },
        {
          status: 401,
        }
      );
    }

    // Get course information from the frontend
    const courseData = await request.json();

    // Basic validation
    if (
      !courseData.category ||
      !courseData.topic ||
      !courseData.difficulty ||
      !courseData.duration
    ) {
      return Response.json(
        {
          success: false,
          error: "Missing required course information.",
        },
        {
          status: 400,
        }
      );
    }

    // Prompt for Gemini
    const prompt = `
You are an expert course designer.

Create a structured course layout based on the following information:

Category: ${courseData.category}
Topic: ${courseData.topic}
Description: ${courseData.description || "No description provided"}
Difficulty: ${courseData.difficulty}
Duration: ${courseData.duration}

Create a beginner-friendly and well-structured learning course.

The course should contain:

- A suitable course title
- A short course description
- 5 to 8 chapters
- Each chapter must have a chapter title
- Each chapter must have a short description
- Each chapter must contain important topics to learn

Return ONLY valid JSON.

Use exactly this structure:

{
  "courseTitle": "string",
  "courseDescription": "string",
  "chapters": [
    {
      "chapterTitle": "string",
      "chapterDescription": "string",
      "topics": [
        "string",
        "string",
        "string"
      ]
    }
  ]
}
`;

    // Generate course using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    // Remove markdown code fences if Gemini adds them
    const cleanText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Convert Gemini response into JavaScript object
    let courseLayout;

    try {
      courseLayout = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", parseError);
      console.error("Gemini response:", text);

      throw new Error("Gemini returned invalid JSON.");
    }

    // Make sure Gemini returned the expected structure
    if (
      !courseLayout.courseTitle ||
      !courseLayout.courseDescription ||
      !Array.isArray(courseLayout.chapters)
    ) {
      throw new Error("Gemini returned an invalid course structure.");
    }

    // Save the generated course to PostgreSQL
    // IMPORTANT: userId connects the course to the logged-in Clerk user
    const savedCourse = await db
      .insert(courses)
      .values({
        userId: userId,

        category: courseData.category,
        topic: courseData.topic,
        description: courseData.description || null,
        difficulty: courseData.difficulty,
        duration: courseData.duration,

        courseTitle: courseLayout.courseTitle,
        courseDescription: courseLayout.courseDescription,
        chapters: courseLayout.chapters,
      })
      .returning();

    console.log("Course saved successfully:", savedCourse);

    return Response.json({
      success: true,
      courseLayout,
      savedCourse,
    });
  } catch (error) {
    console.error("Gemini/Database Error:", error);

    return Response.json(
      {
        success: false,
        error: error.message || "Failed to generate and save course.",
      },
      {
        status: 500,
      }
    );
  }
}