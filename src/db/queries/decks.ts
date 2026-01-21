import { db } from '@/db'
import { decksTable, cardsTable } from '@/db/schema'
import { eq, and, desc, count, sql } from 'drizzle-orm'

/**
 * Get all decks for a specific user with card counts
 */
export async function getUserDecks(userId: string) {
  return await db
    .select({
      id: decksTable.id,
      userId: decksTable.userId,
      title: decksTable.title,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      cardCount: sql<number>`cast(count(${cardsTable.id}) as integer)`,
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(decksTable.id, cardsTable.deckId))
    .where(eq(decksTable.userId, userId))
    .groupBy(decksTable.id)
    .orderBy(desc(decksTable.createdAt))
}

/**
 * Get a specific deck by ID with ownership verification
 */
export async function getDeckById(userId: string, deckId: number) {
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))

  if (!deck) {
    throw new Error('Deck not found or access denied')
  }

  return deck
}

/**
 * Get a deck with all its cards (sorted by most recently updated first)
 */
export async function getDeckWithCards(userId: string, deckId: number) {
  const deck = await db.query.decksTable.findFirst({
    where: and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)),
    with: {
      cards: {
        orderBy: (cards, { desc }) => [desc(cards.updatedAt)],
      },
    },
  })

  if (!deck) {
    throw new Error('Deck not found or access denied')
  }

  return deck
}

/**
 * Create a new deck
 */
export async function createDeck(
  userId: string,
  data: { title: string; description?: string }
) {
  const [newDeck] = await db
    .insert(decksTable)
    .values({
      userId,
      title: data.title,
      description: data.description,
    })
    .returning()

  return newDeck
}

/**
 * Create a deck with cards in a transaction
 */
export async function createDeckWithCards(
  userId: string,
  deckData: { title: string; description?: string },
  cards: Array<{ front: string; back: string }>
) {
  return await db.transaction(async (tx) => {
    // Create deck
    const [newDeck] = await tx
      .insert(decksTable)
      .values({
        userId,
        title: deckData.title,
        description: deckData.description,
      })
      .returning()

    // Add cards if provided
    if (cards.length > 0) {
      await tx.insert(cardsTable).values(
        cards.map((card) => ({
          deckId: newDeck.id,
          front: card.front,
          back: card.back,
        }))
      )
    }

    return newDeck
  })
}

/**
 * Update a deck (verifies ownership)
 */
export async function updateDeck(
  userId: string,
  deckId: number,
  data: { title?: string; description?: string }
) {
  // Verify ownership first
  await getDeckById(userId, deckId)

  await db
    .update(decksTable)
    .set(data)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
}

/**
 * Delete a deck (verifies ownership)
 */
export async function deleteDeck(userId: string, deckId: number) {
  // Verify ownership first
  await getDeckById(userId, deckId)

  await db
    .delete(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
}

/**
 * Get count of cards in a deck
 */
export async function getDeckCardCount(userId: string, deckId: number) {
  // Verify ownership first
  await getDeckById(userId, deckId)

  const result = await db
    .select({ count: cardsTable.id })
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId))

  return result.length
}
