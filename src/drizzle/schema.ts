import { init } from "@paralleldrive/cuid2";
import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';


export const createId = init({
  length: 10,
  random: Math.random,
  fingerprint: "vercel"
})

export const usersTable = pgTable("users", {
  id: varchar("id").primaryKey().$defaultFn(() => {
    return createId()
  }).notNull(),
  name: varchar("name").notNull(),
  username: varchar("username").notNull().unique(),
  email: varchar("email").notNull().unique(),
  picture: varchar("picture"),
  password: varchar("password").notNull(),
  reputation: integer("reputation").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
})

export const vocabulariesTable = pgTable("vocabularies", {
  id: varchar("id").primaryKey().$defaultFn(() => {
    return createId()
  }).notNull(),
  hangul: varchar("varchar").notNull(),
  translation: varchar("translation").notNull(),
  chapter: integer("chapter"),
  reference: varchar("reference"),
  sentenceEx: varchar("sentenceEx"),
  translationEx: varchar("translationEx"),
  note: text("note"),
  audioUrl: varchar("audioUrl"),
  // userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date())
})

export const userInsertSchema = createInsertSchema(usersTable, {
  name: z.string().min(1, "Nama harus diisi"),
  username: z.string().min(1, "Username harus diisi"),
  email: z.string().email().min(1, "Email harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
  picture: z.string().optional(),
})

export const vocabInsertSchema = createInsertSchema(vocabulariesTable, {
  hangul: z.string().min(1, "Hangul tidak boleh kosong"),
  translation: z.string().min(1, "Arti tidak boleh kosong"),
  chapter: z.number().min(1).max(60).optional(),
  reference: z.string().optional(),
  sentenceEx: z.string().optional(),
  translationEx: z.string().optional(),
  note: z.string().optional()
})

export type InsertUserType = typeof usersTable.$inferInsert
export type SelectUserType = typeof usersTable.$inferSelect

export type InsertVocabType = typeof vocabulariesTable.$inferInsert
export type SelectVocabType = typeof vocabulariesTable.$inferSelect