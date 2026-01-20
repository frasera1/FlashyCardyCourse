'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createCard, updateCard, deleteCard, createCards } from '@/db/queries/cards'

// Validation schemas
const createCardSchema = z.object({
  deckId: z.number().positive(),
  front: z.string().min(1, 'Front text is required'),
  back: z.string().min(1, 'Back text is required'),
})

const createCardsSchema = z.object({
  deckId: z.number().positive(),
  cards: z
    .array(
      z.object({
        front: z.string().min(1, 'Front text is required'),
        back: z.string().min(1, 'Back text is required'),
      })
    )
    .min(1, 'At least one card is required'),
})

const updateCardSchema = z.object({
  cardId: z.number().positive(),
  front: z.string().min(1, 'Front text is required').optional(),
  back: z.string().min(1, 'Back text is required').optional(),
})

const deleteCardSchema = z.object({
  cardId: z.number().positive(),
})

// Type exports
export type CreateCardInput = z.infer<typeof createCardSchema>
export type CreateCardsInput = z.infer<typeof createCardsSchema>
export type UpdateCardInput = z.infer<typeof updateCardSchema>
export type DeleteCardInput = z.infer<typeof deleteCardSchema>

/**
 * Create a new card
 */
export async function createCardAction(input: CreateCardInput) {
  // 1. Validate input
  const validated = createCardSchema.parse(input)

  // 2. Authenticate
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // 3. Call mutation function
  const newCard = await createCard(userId, validated.deckId, {
    front: validated.front,
    back: validated.back,
  })

  // 4. Revalidate the deck page
  revalidatePath(`/decks/${validated.deckId}`)

  return newCard
}

/**
 * Create multiple cards at once
 */
export async function createCardsAction(input: CreateCardsInput) {
  // 1. Validate input
  const validated = createCardsSchema.parse(input)

  // 2. Authenticate
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // 3. Call mutation function
  const newCards = await createCards(userId, validated.deckId, validated.cards)

  // 4. Revalidate the deck page
  revalidatePath(`/decks/${validated.deckId}`)

  return newCards
}

/**
 * Update a card
 */
export async function updateCardAction(input: UpdateCardInput & { deckId: number }) {
  // 1. Validate input
  const validated = updateCardSchema.parse(input)

  // 2. Authenticate
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // 3. Call mutation function
  await updateCard(userId, validated.cardId, {
    front: validated.front,
    back: validated.back,
  })

  // 4. Revalidate the deck page
  revalidatePath(`/decks/${input.deckId}`)
}

/**
 * Delete a card
 */
export async function deleteCardAction(input: DeleteCardInput & { deckId: number }) {
  // 1. Validate input
  const validated = deleteCardSchema.parse(input)

  // 2. Authenticate
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // 3. Call mutation function
  await deleteCard(userId, validated.cardId)

  // 4. Revalidate the deck page
  revalidatePath(`/decks/${input.deckId}`)
}
