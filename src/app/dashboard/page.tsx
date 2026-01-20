import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { getUserDecks } from '@/db/queries/decks'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { CreateDeckDialog } from './create-deck-dialog'
import { DeckCard } from './deck-card'

export default async function DashboardPage() {
  const { userId } = await auth()

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Flashy Cardy Course</h1>
          <UserButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Decks</h2>
            <p className="text-muted-foreground mt-2">
              Manage and study your flashcard decks
            </p>
          </div>
          <CreateDeckDialog />
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

