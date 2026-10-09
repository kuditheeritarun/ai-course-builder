import { pgTable, serial, text, json } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),

  userId: text("user_id").notNull(),

  category: text("category").notNull(),
  topic: text("topic").notNull(),
  description: text("description"),

  difficulty: text("difficulty").notNull(),
  duration: text("duration").notNull(),

  courseTitle: text("course_title").notNull(),
  courseDescription: text("course_description"),

  chapters: json("chapters").notNull(),

  completedChapters: json("completed_chapters")
    .notNull()
    .default([]),
});