'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type FlashCard = {
  id: number
  front: string
  back: string
}

type StudySessionProps = {
  cards: FlashCard[]
}

export function StudySession({ cards }: StudySessionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = cards[currentCardIndex]
  const totalCards = cards.length

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex((prev) => prev + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  const handleReset = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        handleFlip()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentCardIndex, totalCards])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-6 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Card {currentCardIndex + 1} of {totalCards}
        </p>
        <div className="mt-2 w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000 mb-8">
        <Card
          className="relative cursor-pointer transition-transform duration-500 transform-style-3d min-h-[300px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          onClick={handleFlip}
        >
          {/* Front */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-sm font-semibold text-muted-foreground mb-4">
                FRONT
              </div>
              <p className="text-xl text-center whitespace-pre-wrap">
                {currentCard.front}
              </p>
              <div className="mt-8 text-sm text-muted-foreground">
                Click to flip
              </div>
            </CardContent>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-secondary">
              <div className="text-sm font-semibold text-muted-foreground mb-4">
                BACK
              </div>
              <p className="text-xl text-center whitespace-pre-wrap">
                {currentCard.back}
              </p>
              <div className="mt-8 text-sm text-muted-foreground">
                Click to flip
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          variant="outline"
          size="lg"
        >
          ← Previous
        </Button>

        <Button onClick={handleReset} variant="outline" size="lg">
          Reset
        </Button>

        {currentCardIndex === totalCards - 1 ? (
          <Button onClick={handleReset} size="lg">
            Start Over
          </Button>
        ) : (
          <Button onClick={handleNext} size="lg">
            Next →
          </Button>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Tip: Use{' '}
          <kbd className="px-2 py-1 bg-secondary rounded">Space</kbd> to flip,{' '}
          <kbd className="px-2 py-1 bg-secondary rounded">←</kbd> /{' '}
          <kbd className="px-2 py-1 bg-secondary rounded">→</kbd> to navigate
        </p>
      </div>
    </div>
  )
}
