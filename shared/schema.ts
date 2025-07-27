import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const posts = pgTable("posts", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
});

// Kaito AI User Profile Schema
export const userProfiles = pgTable("user_profiles", {
  user_id: text("user_id").primaryKey(),
  username: text("username").notNull().unique(),
  yaps_all: text("yaps_all").notNull(),
  yaps_l24h: text("yaps_l24h").notNull(),
  yaps_l48h: text("yaps_l48h").notNull(),
  yaps_l7d: text("yaps_l7d").notNull(),
  yaps_l30d: text("yaps_l30d").notNull(),
  yaps_l3m: text("yaps_l3m").notNull(),
  yaps_l6m: text("yaps_l6m").notNull(),
  yaps_l12m: text("yaps_l12m").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPostSchema = createInsertSchema(posts);
export const insertUserProfileSchema = createInsertSchema(userProfiles);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
