import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { decksTable, cardsTable } from './schema'

const db = drizzle(process.env.DATABASE_URL!)

const userId = 'user_3794YK8Q8xvN6V8KT7wC1oCrQvY'

async function main() {
  console.log('Creating example decks for user:', userId)

  // Create Spanish learning deck
  const spanishDeck: typeof decksTable.$inferInsert = {
    userId: userId,
    title: 'English to Spanish',
    description: 'Learn Spanish by translating common English words',
  }

  const [insertedSpanishDeck] = await db
    .insert(decksTable)
    .values(spanishDeck)
    .returning()
  console.log('✅ Spanish deck created:', insertedSpanishDeck.title)

  // Add Spanish translation cards
  const spanishCards: (typeof cardsTable.$inferInsert)[] = [
    { deckId: insertedSpanishDeck.id, front: 'Hello', back: 'Hola' },
    { deckId: insertedSpanishDeck.id, front: 'Goodbye', back: 'Adiós' },
    { deckId: insertedSpanishDeck.id, front: 'Thank you', back: 'Gracias' },
    { deckId: insertedSpanishDeck.id, front: 'Please', back: 'Por favor' },
    { deckId: insertedSpanishDeck.id, front: 'Yes', back: 'Sí' },
    { deckId: insertedSpanishDeck.id, front: 'No', back: 'No' },
    { deckId: insertedSpanishDeck.id, front: 'Water', back: 'Agua' },
    { deckId: insertedSpanishDeck.id, front: 'Food', back: 'Comida' },
    { deckId: insertedSpanishDeck.id, front: 'House', back: 'Casa' },
    { deckId: insertedSpanishDeck.id, front: 'Dog', back: 'Perro' },
    { deckId: insertedSpanishDeck.id, front: 'Cat', back: 'Gato' },
    { deckId: insertedSpanishDeck.id, front: 'Book', back: 'Libro' },
    { deckId: insertedSpanishDeck.id, front: 'Friend', back: 'Amigo' },
    { deckId: insertedSpanishDeck.id, front: 'Love', back: 'Amor' },
    { deckId: insertedSpanishDeck.id, front: 'Beautiful', back: 'Hermoso' },
  ]

  await db.insert(cardsTable).values(spanishCards)
  console.log(`✅ Added ${spanishCards.length} Spanish cards`)

  // Create British history deck
  const historyDeck: typeof decksTable.$inferInsert = {
    userId: userId,
    title: 'British History',
    description: 'Important dates, events, and facts about British history',
  }

  const [insertedHistoryDeck] = await db
    .insert(decksTable)
    .values(historyDeck)
    .returning()
  console.log('✅ British History deck created:', insertedHistoryDeck.title)

  // Add British history cards
  const historyCards: (typeof cardsTable.$inferInsert)[] = [
    {
      deckId: insertedHistoryDeck.id,
      front: 'When was the Battle of Hastings?',
      back: '1066',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'Who was the first Tudor monarch?',
      back: 'Henry VII',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'In which year did the Great Fire of London occur?',
      back: '1666',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'When did World War I begin?',
      back: '1914',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'When did World War II end?',
      back: '1945',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'Who was the "Iron Lady"?',
      back: 'Margaret Thatcher',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'Which king had six wives?',
      back: 'Henry VIII',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'When did the English Civil War begin?',
      back: '1642',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'Who was the longest-reigning British monarch before Elizabeth II?',
      back: 'Queen Victoria',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'In which year did the Battle of Waterloo take place?',
      back: '1815',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'When did the Industrial Revolution begin in Britain?',
      back: 'Mid-18th century (around 1760)',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'Who led Britain during most of World War II?',
      back: 'Winston Churchill',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'When did the Norman Conquest of England occur?',
      back: '1066',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'Which act united England and Scotland?',
      back: 'The Act of Union (1707)',
    },
    {
      deckId: insertedHistoryDeck.id,
      front: 'When did the British Empire reach its peak?',
      back: 'Early 20th century (around 1920)',
    },
  ]

  await db.insert(cardsTable).values(historyCards)
  console.log(`✅ Added ${historyCards.length} British History cards`)

  console.log('\n🎉 Successfully created both decks with cards!')
  console.log(`   - Spanish deck: ${spanishCards.length} cards`)
  console.log(`   - British History deck: ${historyCards.length} cards`)
}

main().catch(console.error)

