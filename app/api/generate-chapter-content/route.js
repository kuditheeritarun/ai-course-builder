import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithRetry(prompt, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Gemini attempt ${attempt}/${maxRetries}`
      );

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      return response;
    } catch (error) {
      lastError = error;

      const errorMessage =
        error?.message?.toString() || "";

      const errorStatus =
        error?.status ||
        error?.code ||
        "";

      const isTemporaryError =
        errorStatus === 503 ||
        errorStatus === "503" ||
        errorMessage.includes("503") ||
        errorMessage
          .toLowerCase()
          .includes("high demand") ||
        errorMessage
          .toLowerCase()
          .includes("unavailable");

      console.error(
        `Gemini attempt ${attempt} failed:`,
        error
      );

      // Do not retry errors that are not temporary.
      if (!isTemporaryError) {
        throw error;
      }

      // If this was the final attempt, stop.
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff:
      // 3 seconds → 6 seconds → 12 seconds
      const delay = 3000 * Math.pow(2, attempt - 1);

      console.log(
        `Gemini temporarily unavailable. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const courseTitle =
      body.courseTitle?.toString().trim() ||
      "AI Course";

    const chapterTitle =
      body.chapterTitle?.toString().trim() ||
      "Course Chapter";

    const chapterDescription =
      body.chapterDescription?.toString().trim() ||
      "Learn the important concepts covered in this chapter.";

    let topics = Array.isArray(body.topics)
      ? body.topics
      : [];

    topics = topics
      .map((topic) => {
        if (typeof topic === "string") {
          return topic.trim();
        }

        if (
          typeof topic === "object" &&
          topic !== null
        ) {
          return (
            topic.title ||
            topic.name ||
            topic.topic ||
            ""
          )
            .toString()
            .trim();
        }

        return "";
      })
      .filter(Boolean);

    if (topics.length === 0) {
      topics = [
        "Introduction and important concepts",
      ];
    }

    const prompt = `
You are an expert online course instructor and curriculum designer.

Create a COMPLETE, DETAILED, BEGINNER-FRIENDLY learning lesson for the chapter below.

This is not a short summary.

The learner should be able to study this chapter directly from the generated content.

==================================================
COURSE INFORMATION
==================================================

Course Title:
${courseTitle}

Chapter Title:
${chapterTitle}

Chapter Description:
${chapterDescription}

Topics:
${topics
  .map((topic, index) => `${index + 1}. ${topic}`)
  .join("\n")}

==================================================
CONTENT REQUIREMENTS
==================================================

Create detailed educational material for EVERY topic.

For EACH topic:

1. Explain the concept clearly from the basics.

2. Explain WHY the concept is important.

3. Explain HOW the concept works.

4. Give practical and easy-to-understand examples.

5. If the topic is programming-related, include useful code examples and explain the code.

6. If the topic is not programming-related, include realistic practical examples.

7. Explain common mistakes beginners make.

8. Give useful tips for remembering and applying the concept.

9. Provide multiple important points that the learner should remember.

10. Connect the topic to the other topics in the chapter when appropriate.

==================================================
LENGTH REQUIREMENTS
==================================================

Do NOT make the content short.

Introduction:
- 2 to 4 substantial paragraphs.
- Explain what the chapter teaches.
- Explain why the chapter matters.
- Explain what the learner will be able to do after completing it.

Each topic:
- At least 4 to 6 detailed paragraphs.
- Include examples.
- Include practical explanation.
- Include beginner-friendly terminology.
- Include enough information for the learner to actually study the topic.

Each topic should contain at least 5 key points.

Summary:
- 2 to 4 substantial paragraphs.
- Review the most important concepts.
- Explain what the learner should remember.
- Mention practical application.

==================================================
WRITING STYLE
==================================================

Use simple language suitable for a beginner.

Do not assume that the learner already understands advanced concepts.

Introduce difficult terms before using them.

Avoid unnecessary repetition.

Use clear explanations instead of vague statements.

Make the content educational, practical, and useful for real learning.

Do not write filler text just to increase length.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do not return Markdown.

Do not use triple backticks.

Use exactly this structure:

{
  "chapterTitle": "string",
  "introduction": "detailed introduction",
  "topics": [
    {
      "title": "string",
      "content": "detailed educational content with examples and explanations",
      "keyPoints": [
        "important point 1",
        "important point 2",
        "important point 3",
        "important point 4",
        "important point 5"
      ]
    }
  ],
  "summary": "detailed chapter summary"
}

IMPORTANT:
- Create one topic object for EVERY topic provided above.
- Do not skip topics.
- Do not merge multiple topics into one.
- Do not return an empty topic.
- Make the content detailed enough that a beginner can study the chapter without needing another explanation.
`;

    const response = await generateWithRetry(
      prompt,
      3
    );

    const text = response.text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    const cleanText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let chapterContent;

    try {
      chapterContent = JSON.parse(cleanText);
    } catch (error) {
      console.error(
        "Gemini JSON Parse Error:",
        error
      );

      console.error(
        "Gemini Response:",
        text
      );

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    if (
      !chapterContent.chapterTitle ||
      !chapterContent.introduction ||
      !Array.isArray(chapterContent.topics) ||
      !chapterContent.summary
    ) {
      throw new Error(
        "Gemini returned an invalid chapter content structure."
      );
    }

    return NextResponse.json({
      success: true,
      chapterContent,
    });
  } catch (error) {
    console.error(
      "Generate Chapter Content Error:",
      error
    );

    const message =
      error?.message?.toString() ||
      "Failed to generate chapter content.";

    const is503 =
      message.includes("503") ||
      message
        .toLowerCase()
        .includes("high demand") ||
      message
        .toLowerCase()
        .includes("unavailable");

    return NextResponse.json(
      {
        success: false,
        error: is503
          ? "Gemini is temporarily busy. The system automatically retried the request 3 times. Please refresh the chapter and try again."
          : message,
      },
      {
        status: is503 ? 503 : 500,
      }
    );
  }
}