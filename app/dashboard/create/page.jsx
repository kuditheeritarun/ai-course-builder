"use client";

import { useState, useContext } from "react";
import {
  FiBookOpen,
  FiTarget,
  FiEdit3,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";
import { UserInputContext } from "../../_context/UserInputContext";

export default function CreateCoursePage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { setUserCourseInput } = useContext(UserInputContext);

  const [courseData, setCourseData] = useState({
    category: "",
    topic: "",
    description: "",
    difficulty: "Beginner",
    duration: "4 Weeks",
  });

  const categories = [
    {
      name: "Programming",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Health",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Creative",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Business",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Science",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=500&q=80",
    },
  ];

  // ---------------------------------------
  // Update course data
  // ---------------------------------------
  const updateData = (field, value) => {
    setCourseData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ---------------------------------------
  // Next step
  // ---------------------------------------
  const nextStep = () => {
    if (step < 3) {
      setStep((previous) => previous + 1);
    }
  };

  // ---------------------------------------
  // Previous step
  // ---------------------------------------
  const previousStep = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  // ---------------------------------------
  // Generate course
  // ---------------------------------------
  const generateCourse = async () => {
    try {
      setIsGenerating(true);
      setErrorMessage("");

      // Save user input into Context
      setUserCourseInput(courseData);

      console.log("Course Data:", courseData);

      // Send data to API
      const response = await fetch("/api/generate-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      console.log("API Response:", data);

      // Handle API error
      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate course."
        );
      }

      // Make sure course was returned
      if (!data.courseLayout) {
        throw new Error(
          "Course was generated, but no course data was returned."
        );
      }

      console.log(
        "AI Generated Course:",
        data.courseLayout
      );

      // Save generated course in state
      setGeneratedCourse(data.courseLayout);

    } catch (error) {
      console.error(
        "Generate Course Error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Something went wrong while generating the course."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // ---------------------------------------
  // Create another course
  // ---------------------------------------
  const createAnotherCourse = () => {
    setGeneratedCourse(null);
    setErrorMessage("");
    setStep(1);

    setCourseData({
      category: "",
      topic: "",
      description: "",
      difficulty: "Beginner",
      duration: "4 Weeks",
    });
  };

  // =======================================
  // GENERATED COURSE SCREEN
  // =======================================
  if (generatedCourse) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <FiCheck size={32} />
            </div>

            <h1 className="text-3xl font-bold text-purple-600 md:text-4xl">
              Course Generated Successfully!
            </h1>

            <p className="mt-2 text-gray-500">
              Your personalized AI-powered course is ready.
            </p>
          </div>

          {/* Course Header Card */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
                {courseData.category}
              </span>

              <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700">
                {courseData.difficulty}
              </span>

              <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700">
                {courseData.duration}
              </span>
            </div>

            <h2 className="text-3xl font-bold text-slate-900">
              {generatedCourse.courseTitle}
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              {generatedCourse.courseDescription}
            </p>
          </div>

          {/* Chapters */}
          <div className="mb-6">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">
                Course Chapters
              </h2>

              <p className="mt-1 text-gray-500">
                Follow these chapters to complete your learning journey.
              </p>
            </div>

            <div className="space-y-5">
              {generatedCourse.chapters?.map(
                (chapter, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md md:p-7"
                  >
                    {/* Chapter number */}
                    <div className="flex gap-5">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-600">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-slate-900">
                          {chapter.chapterTitle}
                        </h3>

                        <p className="mt-2 leading-6 text-gray-600">
                          {chapter.chapterDescription}
                        </p>

                        {/* Topics */}
                        {chapter.topics?.length > 0 && (
                          <div className="mt-5">
                            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-600">
                              Topics to Learn
                            </h4>

                            <div className="space-y-2">
                              {chapter.topics.map(
                                (topic, topicIndex) => (
                                  <div
                                    key={topicIndex}
                                    className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                                  >
                                    <FiCheck
                                      className="mt-0.5 shrink-0 text-purple-600"
                                      size={18}
                                    />

                                    <span className="text-sm text-gray-700">
                                      {topic}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={createAnotherCourse}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <FiRefreshCw />
              Create Another Course
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700"
            >
              Go to Dashboard
              <FiArrowRight />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =======================================
  // CREATE COURSE FORM
  // =======================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-purple-600 md:text-4xl">
            Create Course
          </h1>

          <p className="mt-2 text-gray-500">
            Create a personalized AI-powered learning course.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 flex items-center justify-center">

          {/* Step 1 */}
          <div className="flex items-center">
            <div
              className={
                step >= 1
                  ? "flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-600 bg-purple-100 text-purple-600"
                  : "flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400"
              }
            >
              {step > 1 ? (
                <FiCheck size={22} />
              ) : (
                <FiBookOpen size={22} />
              )}
            </div>

            <span className="ml-2 hidden text-sm font-medium text-purple-600 sm:block">
              Category
            </span>
          </div>

          {/* Line */}
          <div
            className={
              step >= 2
                ? "mx-3 h-0.5 w-16 bg-purple-600 sm:w-24"
                : "mx-3 h-0.5 w-16 bg-gray-300 sm:w-24"
            }
          />

          {/* Step 2 */}
          <div className="flex items-center">
            <div
              className={
                step >= 2
                  ? "flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-600 bg-purple-100 text-purple-600"
                  : "flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400"
              }
            >
              {step > 2 ? (
                <FiCheck size={22} />
              ) : (
                <FiTarget size={22} />
              )}
            </div>

            <span
              className={
                step >= 2
                  ? "ml-2 hidden text-sm font-medium text-purple-600 sm:block"
                  : "ml-2 hidden text-sm font-medium text-gray-400 sm:block"
              }
            >
              Topic & Description
            </span>
          </div>

          {/* Line */}
          <div
            className={
              step >= 3
                ? "mx-3 h-0.5 w-16 bg-purple-600 sm:w-24"
                : "mx-3 h-0.5 w-16 bg-gray-300 sm:w-24"
            }
          />

          {/* Step 3 */}
          <div className="flex items-center">
            <div
              className={
                step >= 3
                  ? "flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-600 bg-purple-100 text-purple-600"
                  : "flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400"
              }
            >
              <FiEdit3 size={22} />
            </div>

            <span
              className={
                step >= 3
                  ? "ml-2 hidden text-sm font-medium text-purple-600 sm:block"
                  : "ml-2 hidden text-sm font-medium text-gray-400 sm:block"
              }
            >
              Options
            </span>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">

          {/* ================================= */}
          {/* STEP 1 */}
          {/* ================================= */}

          {step === 1 && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  Choose a Category
                </h2>

                <p className="mt-2 text-gray-500">
                  What type of course do you want to create?
                </p>
              </div>

              {/* Categories */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                  const selected =
                    courseData.category === category.name;

                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() =>
                        updateData(
                          "category",
                          category.name
                        )
                      }
                      className={
                        selected
                          ? "group rounded-2xl border-2 border-purple-600 bg-purple-50 p-5 text-center shadow-md transition"
                          : "group rounded-2xl border-2 border-gray-200 bg-white p-5 text-center transition hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                      }
                    >
                      {/* Image */}
                      <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                        />
                      </div>

                      {/* Name */}
                      <h3 className="text-lg font-semibold text-slate-900">
                        {category.name}
                      </h3>

                      {/* Selected */}
                      {selected && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-sm font-medium text-purple-600">
                          <FiCheck size={16} />
                          Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 font-medium text-gray-300"
                >
                  <FiArrowLeft />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!courseData.category}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Next
                  <FiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* ================================= */}
          {/* STEP 2 */}
          {/* ================================= */}

          {step === 2 && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  Tell Us About Your Course
                </h2>

                <p className="mt-2 text-gray-500">
                  Enter the topic and describe what you want to learn.
                </p>
              </div>

              <div className="mx-auto max-w-2xl space-y-6">

                {/* Topic */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Write the topic for which you want to generate a
                    course:
                  </label>

                  <input
                    type="text"
                    value={courseData.topic}
                    onChange={(e) =>
                      updateData(
                        "topic",
                        e.target.value
                      )
                    }
                    placeholder="Example: C++, Python, JavaScript..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Tell us more about your course:
                  </label>

                  <textarea
                    value={courseData.description}
                    onChange={(e) =>
                      updateData(
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Example: I want to learn C++ from basics to object-oriented programming..."
                    rows={6}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <FiArrowLeft />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!courseData.topic.trim()}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Next
                  <FiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* ================================= */}
          {/* STEP 3 */}
          {/* ================================= */}

          {step === 3 && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  Course Options
                </h2>

                <p className="mt-2 text-gray-500">
                  Customize your AI-generated course.
                </p>
              </div>

              <div className="mx-auto max-w-2xl space-y-6">

                {/* Difficulty */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Difficulty Level
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      "Beginner",
                      "Intermediate",
                      "Advanced",
                    ].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          updateData(
                            "difficulty",
                            level
                          )
                        }
                        className={
                          courseData.difficulty === level
                            ? "rounded-lg border-2 border-purple-600 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 transition"
                            : "rounded-lg border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-purple-300 hover:bg-purple-50"
                        }
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Course Duration
                  </label>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      "2 Weeks",
                      "4 Weeks",
                      "6 Weeks",
                      "8 Weeks",
                    ].map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() =>
                          updateData(
                            "duration",
                            duration
                          )
                        }
                        className={
                          courseData.duration === duration
                            ? "rounded-lg border-2 border-purple-600 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 transition"
                            : "rounded-lg border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-purple-300 hover:bg-purple-50"
                        }
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl bg-purple-50 p-5">
                  <h3 className="mb-3 font-semibold text-purple-900">
                    Course Summary
                  </h3>

                  <div className="space-y-2 text-sm text-purple-800">
                    <p>
                      <strong>Category:</strong>{" "}
                      {courseData.category}
                    </p>

                    <p>
                      <strong>Topic:</strong>{" "}
                      {courseData.topic}
                    </p>

                    <p>
                      <strong>Difficulty:</strong>{" "}
                      {courseData.difficulty}
                    </p>

                    <p>
                      <strong>Duration:</strong>{" "}
                      {courseData.duration}
                    </p>
                  </div>
                </div>

                {/* Ready Status */}
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-700">
                  Your course information is ready to be sent to AI.
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={isGenerating}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiArrowLeft />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={generateCourse}
                  disabled={isGenerating}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isGenerating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate AI Course
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}