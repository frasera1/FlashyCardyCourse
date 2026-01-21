'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EditDeckDialog } from './edit-deck-dialog'
import { DeleteDeckDialog } from './delete-deck-dialog'

type Deck = {
  id: number
  title: string
  description: string | null
  updatedAt: Date
  cardCount: number
}

export function DeckCard({ deck }: { deck: Deck }) {
  return (
    <Card className="hover:border-primary transition-colors h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/decks/${deck.id}`} className="flex-1 cursor-pointer">
            <CardTitle className="hover:text-primary transition-colors">
              {deck.title}
            </CardTitle>
            {deck.description && (
              <CardDescription className="mt-1.5">
                {deck.description}
              </CardDescription>
            )}
          </Link>
          <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <EditDeckDialog deck={deck} />
            <DeleteDeckDialog deck={deck} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated {new Date(deck.updatedAt).toLocaleDateString()}</span>
          <span>{deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}</span>
        </div>
        <Link href={`/decks/${deck.id}/study`} onClick={(e) => e.stopPropagation()}>
          <Button variant="default" className="w-full" size="sm">
            Study
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
