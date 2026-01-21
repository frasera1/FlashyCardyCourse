import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserDecks } from '@/db/queries/decks'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { CreateDeckDialog } from './create-deck-dialog'
import { DeckCard } from './deck-card'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'

export default async function DashboardPage() {
  const { userId, has } = await auth()

  if (!userId) {
    redirect('/')
  }

  // Fetch user's decks using query function
  let decks: Awaited<ReturnType<typeof getUserDecks>>
  try {
    decks = await getUserDecks(userId)
  } catch (error) {
    console.error('Failed to fetch decks:', error)
    decks = []
  }

  // Check if user has unlimited decks feature (Pro plan)
  const hasUnlimitedDecks = has({ feature: 'unlimited_decks' })

  // Determine if user can create more decks
  const canCreateDeck = hasUnlimitedDecks || decks.length < 3
  const deckCount = decks.length
  const deckLimit = hasUnlimitedDecks ? null : 3

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Decks</h2>
            <p className="text-muted-foreground mt-2">
              Manage and study your flashcard decks
            </p>
            {!hasUnlimitedDecks && (
              <p className="text-sm text-muted-foreground mt-1">
                {deckCount} of {deckLimit} decks created.{' '}
                <Link href="/pricing" className="text-primary hover:underline">
                  Upgrade to Pro
                </Link>{' '}
                for unlimited decks.
              </p>
            )}
          </div>
          <CreateDeckDialog
            disabled={!canCreateDeck}
            deckCount={deckCount}
            deckLimit={deckLimit}
          />
        </div>
        {decks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                You do not have any decks yet. Create your first deck to get
                started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

