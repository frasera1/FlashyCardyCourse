import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { decksTable } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { UserButton } from '@clerk/nextjs'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  // Fetch user's decks
  const decks = await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.userId, userId))
    .orderBy(desc(decksTable.createdAt))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Flashy Cardy Course</h1>
          <UserButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Your Decks</h2>
          <p className="text-muted-foreground mt-2">
            Manage and study your flashcard decks
          </p>
        </div>
        {decks.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              You don't have any decks yet. Create your first deck to get
              started!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {deck.title}
                </h3>
                {deck.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {deck.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  Created{' '}
                  {new Date(deck.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

