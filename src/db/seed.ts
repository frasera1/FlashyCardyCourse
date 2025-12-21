import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { decksTable, cardsTable } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Example: Create a deck for learning Indonesian
  const indonesianDeck: typeof decksTable.$inferInsert = {
    userId: "user_example_123", // Replace with actual Clerk user ID
    title: "Indonesian Language Basics",
    description: "Learn common Indonesian words and phrases",
  };

  const [insertedDeck] = await db
    .insert(decksTable)
    .values(indonesianDeck)
    .returning();
  console.log("New deck created:", insertedDeck);

  // Add cards to the deck
  const cards: (typeof cardsTable.$inferInsert)[] = [
    {
      deckId: insertedDeck.id,
      front: "Dog",
      back: "Anjing",
    },
    {
      deckId: insertedDeck.id,
      front: "Cat",
      back: "Kucing",
    },
    {
      deckId: insertedDeck.id,
      front: "Hello",
      back: "Halo",
    },
  ];

  await db.insert(cardsTable).values(cards);
  console.log("Cards added to deck!");

  // Example: Create a deck for British history
  const historyDeck: typeof decksTable.$inferInsert = {
    userId: "user_example_123",
    title: "British History",
    description: "Important dates and events in British history",
  };

  const [insertedHistoryDeck] = await db
    .insert(decksTable)
    .values(historyDeck)
    .returning();
  console.log("New history deck created:", insertedHistoryDeck);

  const historyCards: (typeof cardsTable.$inferInsert)[] = [
    {
      deckId: insertedHistoryDeck.id,
      front: "When was the battle of hastings?",
      back: "1066",
    },
    {
      deckId: insertedHistoryDeck.id,
      front: "When did World War I begin?",
      back: "1914",
    },
  ];

  await db.insert(cardsTable).values(historyCards);
  console.log("History cards added!");

  // Query all decks for a user
  const userDecks = await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.userId, "user_example_123"));
  console.log("All decks for user:", userDecks);

  // Query all cards in a deck
  const deckCards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, insertedDeck.id));
  console.log("All cards in Indonesian deck:", deckCards);

  // Update a card
  await db
    .update(cardsTable)
    .set({
      back: "Anjing (updated)",
    })
    .where(eq(cardsTable.front, "Dog"));
  console.log("Card updated!");

  // Delete a card
  await db.delete(cardsTable).where(eq(cardsTable.front, "Cat"));
  console.log("Card deleted!");

  // Delete a deck (this will cascade delete all its cards)
  await db.delete(decksTable).where(eq(decksTable.id, insertedDeck.id));
  console.log("Deck deleted (cards cascade deleted)!");
}

main();

