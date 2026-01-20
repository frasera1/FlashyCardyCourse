# Database Architecture

This document explains the database query pattern used in this project.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT COMPONENTS                             │
│                (Browser - React Components)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │ Call Server Actions
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER ACTIONS                                │
│              (app/actions/*.ts files)                            │
│                                                                   │
│  Responsibilities:                                                │
│  1. Validate input with Zod                                       │
│  2. Authenticate with Clerk                                       │
│  3. Call query/mutation functions                                │
│  4. Revalidate cache                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────────┐
│                  SERVER COMPONENTS                               │
│                (app/**/page.tsx files)                           │
│                                                                   │
│  Responsibilities:                                                │
│  1. Authenticate with Clerk                                       │
│  2. Call query functions                                          │
│  3. Render UI                                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │ Both call
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   QUERY FUNCTIONS                                │
│              (db/queries/*.ts files)                             │
│                                                                   │
│  Responsibilities:                                                │
│  1. Accept userId parameter                                       │
│  2. Filter queries by userId                                      │
│  3. Verify ownership                                              │
│  4. Execute database operations                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │ Use
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DRIZZLE ORM                                   │
│              (db/index.ts, db/schema.ts)                         │
│                                                                   │
│  - Database connection                                            │
│  - Table schemas                                                  │
│  - Type safety                                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE                                    │
│                   (PostgreSQL/Neon)                              │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── db/
│   ├── index.ts                    # Database connection
│   ├── schema.ts                   # Table schemas
│   └── queries/                    # ⭐ Query functions (NEW)
│       ├── index.ts                # Re-exports all queries
│       ├── decks.ts                # Deck operations
│       ├── cards.ts                # Card operations
│       └── README.md               # Documentation
│
├── app/
│   ├── actions/                    # ⭐ Server Actions (NEW)
│   │   ├── deck-actions.ts         # Deck mutations
│   │   └── card-actions.ts         # Card mutations
│   │
│   └── [routes]/
│       └── page.tsx                # Server Components (call queries)
```

## What Was Created

### 1. Query Functions (`src/db/queries/`)

**Purpose**: Centralize all database operations with built-in security

**Files Created**:
- `decks.ts` - All deck-related operations
- `cards.ts` - All card-related operations
- `index.ts` - Convenience exports
- `README.md` - Full documentation

**Key Features**:
- ✅ All functions accept `userId` parameter
- ✅ Automatic ownership verification
- ✅ Filtered by userId for security
- ✅ Clear, descriptive function names
- ✅ JSDoc comments for documentation

### 2. Server Actions (`src/app/actions/`)

**Purpose**: Handle mutations with validation and authentication

**Files Created**:
- `deck-actions.ts` - Create, update, delete decks
- `card-actions.ts` - Create, update, delete cards

**Pattern**:
```typescript
export async function createDeckAction(input: CreateDeckInput) {
  // 1. Validate with Zod
  const validated = createDeckSchema.parse(input)
  
  // 2. Authenticate with Clerk
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  // 3. Call query function
  const deck = await createDeck(userId, validated)
  
  // 4. Revalidate cache
  revalidatePath('/dashboard')
  
  return deck
}
```

### 3. Refactored Existing Code

**Updated Files**:
- `src/app/dashboard/page.tsx` - Now uses `getUserDecks()` instead of direct queries
- `src/db/add-example-decks.ts` - Now uses `createDeckWithCards()` instead of direct queries

## How to Use

### In Server Components (Reading Data)

```typescript
// app/decks/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserDecks } from '@/db/queries/decks'

export default async function DecksPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  
  // ✅ Call query function
  const decks = await getUserDecks(userId)
  
  return <div>{/* render decks */}</div>
}
```

### In Client Components (Mutations)

```typescript
// components/create-deck-form.tsx
'use client'

import { createDeckAction } from '@/app/actions/deck-actions'

export function CreateDeckForm() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // ✅ Call server action
    await createDeckAction({ 
      title: 'My Deck',
      description: 'Optional description'
    })
  }
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>
}
```

## Available Functions

### Decks

**Queries** (read operations):
- `getUserDecks(userId)` - Get all user's decks
- `getDeckById(userId, deckId)` - Get one deck
- `getDeckWithCards(userId, deckId)` - Get deck with cards
- `getDeckCardCount(userId, deckId)` - Count cards in deck

**Mutations** (write operations):
- `createDeck(userId, data)` - Create deck
- `createDeckWithCards(userId, deckData, cards)` - Create deck with cards (transaction)
- `updateDeck(userId, deckId, data)` - Update deck
- `deleteDeck(userId, deckId)` - Delete deck

### Cards

**Queries**:
- `getDeckCards(userId, deckId)` - Get all cards for a deck
- `getCardById(userId, cardId)` - Get one card

**Mutations**:
- `createCard(userId, deckId, data)` - Create one card
- `createCards(userId, deckId, cards)` - Create multiple cards
- `updateCard(userId, cardId, data)` - Update card
- `deleteCard(userId, cardId)` - Delete card
- `deleteAllDeckCards(userId, deckId)` - Delete all cards from deck

## Security Features

All query functions implement:

1. **Authentication**: Require userId from authenticated source
2. **Authorization**: Verify ownership before operations
3. **Scoping**: Filter all queries by userId
4. **Validation**: Input validation in Server Actions (Zod)

## Best Practices

### ✅ DO

- Call query functions from Server Components and Server Actions
- Pass authenticated userId to all query functions
- Validate input with Zod in Server Actions
- Use descriptive function names
- Add JSDoc comments to new functions

### ❌ DON'T

- Write direct Drizzle queries in Server Components
- Write direct Drizzle queries in Server Actions
- Trust userId from client input
- Skip ownership verification
- Expose query functions to client-side code

## Testing

Query functions can be tested independently:

```typescript
import { getUserDecks } from '@/db/queries/decks'

// Test with mock database
const decks = await getUserDecks('test_user_123')
expect(decks).toHaveLength(2)
```

## Migration Guide

When you encounter existing direct database queries:

**Before** (❌ Old pattern):
```typescript
import { db } from '@/db'
import { decksTable } from '@/db/schema'

const decks = await db
  .select()
  .from(decksTable)
  .where(eq(decksTable.userId, userId))
```

**After** (✅ New pattern):
```typescript
import { getUserDecks } from '@/db/queries/decks'

const decks = await getUserDecks(userId)
```

## Adding New Query Functions

1. Add function to appropriate file in `db/queries/`
2. Include `userId` parameter for user-scoped operations
3. Verify ownership for sensitive operations
4. Add JSDoc comment
5. Export from `index.ts`

See `db/queries/README.md` for detailed examples.

## Questions?

- See `db/queries/README.md` for detailed documentation
- Check `app/actions/*.ts` for Server Action examples
- Review `.cursor/rules/*.mdc` for full coding standards
