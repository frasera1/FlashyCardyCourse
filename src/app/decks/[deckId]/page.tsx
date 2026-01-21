import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getDeckWithCards } from '@/db/queries/decks'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateCardDialog } from './create-card-dialog'
import { EditCardDialog } from './edit-card-dialog'
import { DeleteCardDialog } from './delete-card-dialog'
import { GenerateAICardsButton } from './generate-ai-cards-button'
import { AppHeader } from '@/components/app-header'

type DeckCard = {
  id: number
  deckId: number
  front: string
  back: string
  createdAt: Date
  updatedAt: Date
}

type PageProps = {
  params: Promise<{
    deckId: string
  }>
}

export default async function DeckPage(props: PageProps) {
  const { userId, has } = await auth()

  if (!userId) {
    redirect('/')
  }

  const params = await props.params
  const deckId = parseInt(params.deckId, 10)

  // Validate deckId is a valid number
  if (isNaN(deckId)) {
    notFound()
  }

  // Check if user has AI generation feature
  const hasAIGeneration = has({ feature: 'ai_flashcard_generation' })

  // Fetch deck with cards using query function
  let deck: Awaited<ReturnType<typeof getDeckWithCards>>
  try {
    deck = await getDeckWithCards(userId, deckId)
  } catch {
    // If deck not found or access denied, show 404
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{deck.title}</h2>
            {deck.description && (
              <p className="text-muted-foreground mt-2">{deck.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
            </p>
          </div>
          <div className="flex gap-2">
            {deck.cards.length > 0 && (
              <Link href={`/decks/${deck.id}/study`}>
                <Button variant="default">Study</Button>
              </Link>
            )}
            <GenerateAICardsButton
              deckId={deck.id}
              deckTitle={deck.title}
              deckDescription={deck.description}
              hasAIGeneration={hasAIGeneration}
            />
            <CreateCardDialog deckId={deck.id} />
          </div>
        </div>

        {deck.cards.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                This deck doesnot have any cards yet. Add your first card to get
                started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deck.cards.map((card: DeckCard) => (
              <Card key={card.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">Front</CardTitle>
                    <div className="flex gap-2">
                      <EditCardDialog card={card} />
                      <DeleteCardDialog card={card} />
                    </div>
                  </div>
                  <CardDescription className="whitespace-pre-wrap">
                    {card.front}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold mb-1">Back</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {card.back}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
