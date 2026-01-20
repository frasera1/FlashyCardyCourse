import { db } from '@/db'
import { decksTable, cardsTable } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Get all cards for a deck (with ownership verification)
 */
export async function getDeckCards(userId: string, deckId: number) {
  // First verify the deck belongs to the user
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))

  if (!deck) {
    throw new Error('Deck not found or access denied')
  }

  // Then get cards for the verified deck
  return await db.select().from(cardsTable).where(eq(cardsTable.deckId, deckId))
}

/**
 * Get a specific card by ID (with ownership verification via deck)
 */
export async function getCardById(userId: string, cardId: number) {
  // Join with deck to verify ownership
  const [result] = await db
    .select({
      card: cardsTable,
      deck: decksTable,
    })
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)))

  if (!result) {
    throw new Error('Card not found or access denied')
  }

  return result.card
}

/**
 * Create a new card (with ownership verification)
 */
export async function createCard(
  userId: string,
  deckId: number,
  data: { front: string; back: string }
) {
  // Verify deck ownership first
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))

  if (!deck) {
    throw new Error('Deck not found or access denied')
  }

  const [newCard] = await db
    .insert(cardsTable)
    .values({
      deckId,
      front: data.front,
      back: data.back,
    })
    .returning()

  return newCard
}

/**
 * Create multiple cards at once (with ownership verification)
 */
export async function createCards(
  userId: string,
  deckId: number,
  cards: Array<{ front: string; back: string }>
) {
  // Verify deck ownership first
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))

  if (!deck) {
    throw new Error('Deck not found or access denied')
  }

  if (cards.length === 0) {
    return []
  }

  return await db
    .insert(cardsTable)
    .values(
      cards.map((card) => ({
        deckId,
        front: card.front,
        back: card.back,
      }))
    )
    .returning()
}

/**
 * Update a card (with ownership verification via deck)
 */
export async function updateCard(
  userId: string,
  cardId: number,
  data: { front?: string; back?: string }
) {
  // Verify ownership first
  const card = await getCardById(userId, cardId)

  await db
    .update(cardsTable)
    .set({
      ...data,
      updatedAt: new Date(), // Explicitly set updatedAt to current time
    })
    .where(eq(cardsTable.id, cardId))
}

/**
 * Delete a card (with ownership verification via deck)
 */
export async function deleteCard(userId: string, cardId: number) {
  // Verify ownership first
  const card = await getCardById(userId, cardId)

  await db.delete(cardsTable).where(eq(cardsTable.id, cardId))
}

/**
 * Delete all cards from a deck (with ownership verification)
 */
export async function deleteAllDeckCards(userId: string, deckId: number) {
  // Verify deck ownership first
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))

  if (!deck) {
    throw new Error('Deck not found or access denied')
  }

  await db.delete(cardsTable).where(eq(cardsTable.deckId, deckId))
}
