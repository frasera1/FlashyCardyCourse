import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            Flashy Cardy Course
          </h1>
          <UserButton />
        </div>
      </header>
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
          <CreateCardDialog deckId={deck.id} />
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
