import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Decks table - stores flashcard decks created by users
export const decksTable = pgTable("decks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  title: varchar({ length: 255 }).notNull(),
  description: text(), // Optional description of the deck
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cards table - stores individual flashcards within a deck
export const cardsTable = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deckId: integer("deck_id")
    .notNull()
    .references(() => decksTable.id, { onDelete: "cascade" }), // Foreign key to decks
  front: text().notNull(), // The question/prompt side of the card
  back: text().notNull(), // The answer side of the card
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relationships
export const decksRelations = relations(decksTable, ({ many }) => ({
  cards: many(cardsTable), // A deck has many cards
}));

export const cardsRelations = relations(cardsTable, ({ one }) => ({
  deck: one(decksTable, {
    fields: [cardsTable.deckId],
    references: [decksTable.id],
  }), // A card belongs to one deck
}));
