"use client";

import { useState } from "react";

export default function DeleteCourseButton({ courseId }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete course.");
      }

      // Reload the page so the deleted course disappears
      window.location.reload();
    } catch (error) {
      console.error("Delete course error:", error);

      alert(
        error.message ||
          "Something went wrong while deleting the course."
      );

      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}