# Database Query Functions

This directory contains all database query and mutation functions. All database operations **MUST** go through these helper functions - never write direct Drizzle queries in Server Components or Server Actions.

## Architecture

```
Server Components/Actions → Query Functions (db/queries) → Database
         ↓                          ↓
    Auth & Validation         Database Operations
```

## Available Query Functions

### Decks (`decks.ts`)

#### Query Functions
- `getUserDecks(userId)` - Get all decks for a user
- `getDeckById(userId, deckId)` - Get a specific deck with ownership verification
- `getDeckWithCards(userId, deckId)` - Get a deck with all its cards
- `getDeckCardCount(userId, deckId)` - Get count of cards in a deck

#### Mutation Functions
- `createDeck(userId, data)` - Create a new deck
- `createDeckWithCards(userId, deckData, cards)` - Create a deck with cards (transaction)
- `updateDeck(userId, deckId, data)` - Update a deck
- `deleteDeck(userId, deckId)` - Delete a deck

### Cards (`cards.ts`)

#### Query Functions
- `getDeckCards(userId, deckId)` - Get all cards for a deck
- `getCardById(userId, cardId)` - Get a specific card

#### Mutation Functions
- `createCard(userId, deckId, data)` - Create a new card
- `createCards(userId, deckId, cards)` - Create multiple cards at once
- `updateCard(userId, cardId, data)` - Update a card
- `deleteCard(userId, cardId)` - Delete a card
- `deleteAllDeckCards(userId, deckId)` - Delete all cards from a deck

## Usage Examples

### In Server Components

```typescript
// app/decks/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserDecks } from '@/db/queries/decks'

export default async function DecksPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // ✅ Call query function
  const decks = await getUserDecks(userId)

  return <div>{/* render decks */}</div>
}
```

### In Server Actions

```typescript
// app/actions/deck-actions.ts
'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { createDeck, updateDeck, deleteDeck } from '@/db/queries/decks'

const createDeckSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
})

export async function createDeckAction(input: z.infer<typeof createDeckSchema>) {
  // 1. Validate input
  const validated = createDeckSchema.parse(input)

  // 2. Authenticate
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // 3. Call mutation function
  return await createDeck(userId, validated)
}
```

## Key Principles

### ✅ DO

1. **Accept userId as a parameter** - All query functions should accept userId
2. **Verify ownership** - Always verify the user owns the resource before operations
3. **Filter by userId** - Always filter queries by userId
4. **Use transactions** - Use transactions for multi-step operations
5. **Throw errors** - Throw descriptive errors when resources aren't found

### ❌ DON'T

1. **Never trust client data** - Never accept userId from client input
2. **Never skip ownership checks** - Always verify ownership before updates/deletes
3. **Never expose to client** - Query functions are server-side only
4. **Never write direct queries elsewhere** - All queries must be in this directory

## Adding New Query Functions

When adding new query functions:

1. **Location**: Add to appropriate file in `db/queries/`
2. **Naming**: Use descriptive names (e.g., `getUserDecks`, `createCard`)
3. **Parameters**: Always include `userId` for user-scoped operations
4. **Ownership**: Verify ownership for sensitive operations
5. **Error handling**: Throw errors with clear messages
6. **Documentation**: Add JSDoc comments explaining the function

Example:

```typescript
/**
 * Get all cards for a deck (with ownership verification)
 */
export async function getDeckCards(userId: string, deckId: number) {
  // Verify deck ownership
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))

  if (!deck) {
    throw new Error('Deck not found or access denied')
  }

  // Return cards
  return await db.select().from(cardsTable).where(eq(cardsTable.deckId, deckId))
}
```

## Security

All query functions implement security best practices:

- **Authentication**: Functions accept authenticated userId from caller
- **Authorization**: Ownership is verified before operations
- **Scoping**: Queries are filtered by userId
- **Validation**: Input validation happens in Server Actions (before calling queries)

## Testing

Query functions can be tested independently:

```typescript
import { getUserDecks } from '@/db/queries/decks'

// Mock or use test database
const decks = await getUserDecks('test_user_id')
expect(decks).toHaveLength(2)
```
