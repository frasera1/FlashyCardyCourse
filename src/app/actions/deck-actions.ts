'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import {
  createDeck,
  updateDeck,
  deleteDeck,
  createDeckWithCards,
} from '@/db/queries/decks'

// Validation schemas
const createDeckSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
})

const createDeckWithCardsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
  cards: z
    .array(
      z.object({
        front: z.string().min(1, 'Front text is required'),
        back: z.string().min(1, 'Back text is required'),
      })
    )
    .min(1, 'At least one card is required'),
})

const updateDeckSchema = z.object({
  deckId: z.number().positive(),
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
  description: z.string().optional(),
})

const deleteDeckSchema = z.object({
  deckId: z.number().positive(),
})

// Type exports
export type CreateDeckInput = z.infer<typeof createDeckSchema>
export type CreateDeckWithCardsInput = z.infer<typeof createDeckWithCardsSchema>
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>
export type DeleteDeckInput = z.infer<typeof deleteDeckSchema>

/**
 * Create a new deck
 */
export async function createDeckAction(input: CreateDeckInput) {
  // 1. Validate input
  const validated = createDeckSchema.parse(input)

  // 2. Authenticate
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // 3. Call mutation function
  const newDeck = await createDeck(userId, validated)

  // 4. Revalidate the dashboard page
  revalidatePath('/dashboard')

  return newDeck
}

/**
 * Create a deck with cards (all in one transaction)
 */
export async function createDeckWithCardsAction(input: CreateDeckWithCardsInput) {
  // 1. Validate input
  const validated = createDeckWithCardsSchema.parse(input)

  // 2. Authenticate
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // 3. Call mutation function
  const newDeck = await createDeckWithCards(
    userId,
    {
      title: validated.title,
      description: validated.description,
    },
    validated.cards
  )

  // 4. Revalidate the dashboard page
  revalidatePath('/dashboard')

  return newDeck
}

/**
 * Update a deck
 */
export async function updateDeckAction(input: UpdateDeckInput) {
  // 1. Validate input
  const validated = updateDeckSchema.parse(input)

  // 2. Authenticate
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // 3. Call mutation function
  await updateDeck(userId, validated.deckId, {
    title: validated.title,
    description: validated.description,
  })

  // 4. Revalidate affected pages
  revalidatePath('/dashboard')
  revalidatePath(`/decks/${validated.deckId}`)
}

/**
 * Delete a deck
 */
export async function deleteDeckAction(input: DeleteDeckInput) {
  // 1. Validate input
  const validated = deleteDeckSchema.parse(input)

  // 2. Authenticate
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // 3. Call mutation function
  await deleteDeck(userId, validated.deckId)

  // 4. Revalidate the dashboard page
  revalidatePath('/dashboard')
}
