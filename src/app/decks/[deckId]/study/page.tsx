import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { getDeckWithCards } from '@/db/queries/decks'
import { StudySession } from './study-session'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AppHeader } from '@/components/app-header'

type PageProps = {
  params: Promise<{
    deckId: string
  }>
}

export default async function StudyPage(props: PageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  const params = await props.params
  const deckId = parseInt(params.deckId, 10)

  // Validate deckId is a valid number
  if (isNaN(deckId)) {
    notFound()
  }

  // Fetch deck with cards using query function
  let deck: Awaited<ReturnType<typeof getDeckWithCards>>
  try {
    deck = await getDeckWithCards(userId, deckId)
  } catch {
    // If deck not found or access denied, show 404
    notFound()
  }

  // If no cards, redirect back to deck page
  if (deck.cards.length === 0) {
    redirect(`/decks/${deckId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/decks/${deckId}`}>
            <Button variant="outline">← Back to Deck</Button>
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">{deck.title}</h2>
          {deck.description && (
            <p className="text-muted-foreground mt-2">{deck.description}</p>
          )}
        </div>

        <StudySession cards={deck.cards} />
      </main>
    </div>
  )
}
