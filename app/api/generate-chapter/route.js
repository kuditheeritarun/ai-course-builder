import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

    const data = await request.json();

    const {
      courseTitle,
      chapterTitle,
      chapterDescription,
      topics,
    } = data;

    if (!courseTitle || !chapterTitle) {
      return Response.json(
        {
          success: false,
          error: "Missing chapter information.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert course instructor.

Create detailed educational content for this chapter.

Course Title:
${courseTitle}

Chapter Title:
${chapterTitle}

Chapter Description:
${chapterDescription || "No description provided"}

Topics:
${Array.isArray(topics) ? topics.join(", ") : "No topics provided"}

Create beginner-friendly learning content.

Include:

1. Introduction
2. Detailed explanation of each topic
3. Practical examples
4. Important points to remember
5. Short summary
6. Three practice questions

Use clear and simple language.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const content = response.text;

    if (!content) {
      throw new Error("Gemini returned an empty response.");
    }

    return Response.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Generate Chapter Error:", error);

    return Response.json(
      {
        success: false,
        error:
          error.message || "Failed to generate chapter content.",
      },
      { status: 500 }
    );
  }
}