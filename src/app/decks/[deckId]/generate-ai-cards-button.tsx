'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Sparkles, AlertCircle } from 'lucide-react'
import { generateFlashcardsWithAIAction } from '@/app/actions/ai-actions'
import { toast } from 'sonner'

type GenerateAICardsButtonProps = {
  deckId: number
  deckTitle: string
  deckDescription?: string | null
  hasAIGeneration: boolean
}

export function GenerateAICardsButton({
  deckId,
  deckTitle,
  deckDescription,
  hasAIGeneration,
}: GenerateAICardsButtonProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  // Check if deck has required description
  const hasDescription = !!deckDescription && deckDescription.trim().length > 0

  const handleClick = async () => {
    // If deck is missing description, show toast and don't proceed
    if (!hasDescription) {
      toast.error('Please add a description to this deck first', {
        description:
          'AI needs a description to understand what flashcards to generate. Edit your deck to add one.',
      })
      return
    }

    // If user doesn't have access, redirect to pricing
    if (!hasAIGeneration) {
      router.push('/pricing')
      return
    }

    // Generate flashcards with AI
    setIsGenerating(true)
    try {
      const result = await generateFlashcardsWithAIAction({
        deckId,
        deckTitle,
        deckDescription: deckDescription!,
      })

      toast.success(
        `Successfully generated ${result.cardsGenerated} flashcards with AI!`
      )
    } catch (error) {
      console.error('Failed to generate flashcards:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to generate flashcards. Please try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // If deck is missing description, show disabled button with tooltip
  if (!hasDescription) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              <Button
                onClick={handleClick}
                disabled
                variant="outline"
                className="gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Generate Cards with AI
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a description to this deck to use AI generation.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // If user has access, show regular button
  if (hasAIGeneration) {
    return (
      <Button
        onClick={handleClick}
        disabled={isGenerating}
        variant="outline"
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        {isGenerating ? 'Generating...' : 'Generate Cards with AI'}
      </Button>
    )
  }

  // If user doesn't have access, show button with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleClick} variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Cards with AI
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a Pro feature. Click to view pricing and upgrade.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
