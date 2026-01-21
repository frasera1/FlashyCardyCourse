'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { revalidatePath } from 'next/cache'
import { createCards } from '@/db/queries/cards'
import { getDeckById } from '@/db/queries/decks'

// Input validation schema
const generateFlashcardsSchema = z.object({
  deckId: z.number().positive(),
  deckTitle: z.string().min(1),
  deckDescription: z
    .string()
    .min(1, 'Deck description is required for AI generation'),
})

export type GenerateFlashcardsInput = z.infer<typeof generateFlashcardsSchema>

/**
 * Generate flashcards using AI based on deck title and description
 */
export async function generateFlashcardsWithAIAction(
  input: GenerateFlashcardsInput
) {
  try {
    // 1. Validate input
    const validated = generateFlashcardsSchema.parse(input)

    // 2. Authenticate and check feature access
    const { userId, has } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // Check if user has AI generation feature
    const hasAIGeneration = has({ feature: 'ai_flashcard_generation' })

    if (!hasAIGeneration) {
      throw new Error(
        'AI flashcard generation is only available for Pro subscribers.'
      )
    }

    // 3. Verify deck ownership
    await getDeckById(userId, validated.deckId)

    // 4. Generate flashcards with AI
    const prompt = `Generate exactly 20 educational flashcards about "${validated.deckTitle}" with the following context: ${validated.deckDescription}

Requirements:
- Each question should be clear, specific, and test understanding
- Each answer should be comprehensive yet concise (2-4 sentences maximum)
- Use simple language appropriate for learning
- Avoid ambiguous questions
- Focus on key concepts and practical knowledge
- Ensure factual accuracy
- Cover different aspects of the topic
- Progress from basic to more advanced concepts
- Use the deck description to understand the scope and focus of the flashcards

Format each card with:
- Front: A clear question or prompt
- Back: A detailed but digestible answer`

    const { output } = await generateText({
      model: openai('gpt-4o-mini'),
      output: Output.object({
        schema: z.object({
          cards: z
            .array(
              z.object({
                front: z
                  .string()
                  .min(5)
                  .max(500)
                  .describe('Question or prompt'),
                back: z
                  .string()
                  .min(10)
                  .max(1000)
                  .describe('Answer or explanation'),
              })
            )
            .length(20),
        }),
      }),
      prompt,
    })

    // 5. Save cards to database
    const savedCards = await createCards(userId, validated.deckId, output.cards)

    // 6. Revalidate the deck page
    revalidatePath(`/decks/${validated.deckId}`)

    return {
      success: true,
      cardsGenerated: savedCards.length,
      cards: savedCards,
    }
  } catch (error) {
    console.error('AI generation failed:', error)

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key not configured')
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      if (error.message.includes('Pro subscribers')) {
        throw error // Re-throw feature access error
      }
      if (error.message.includes('Deck not found')) {
        throw error // Re-throw ownership error
      }
    }

    throw new Error('Failed to generate flashcards. Please try again.')
  }
}
