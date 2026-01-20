import 'dotenv/config'
import { createDeckWithCards } from './queries/decks'

const userId = 'user_3794YK8Q8xvN6V8KT7wC1oCrQvY'

async function main() {
  console.log('Creating example decks for user:', userId)

  // Create Spanish learning deck with cards
  const spanishCards = [
    { front: 'Hello', back: 'Hola' },
    { front: 'Goodbye', back: 'Adiós' },
    { front: 'Thank you', back: 'Gracias' },
    { front: 'Please', back: 'Por favor' },
    { front: 'Yes', back: 'Sí' },
    { front: 'No', back: 'No' },
    { front: 'Water', back: 'Agua' },
    { front: 'Food', back: 'Comida' },
    { front: 'House', back: 'Casa' },
    { front: 'Dog', back: 'Perro' },
    { front: 'Cat', back: 'Gato' },
    { front: 'Book', back: 'Libro' },
    { front: 'Friend', back: 'Amigo' },
    { front: 'Love', back: 'Amor' },
    { front: 'Beautiful', back: 'Hermoso' },
  ]

  const insertedSpanishDeck = await createDeckWithCards(
    userId,
    {
      title: 'English to Spanish',
      description: 'Learn Spanish by translating common English words',
    },
    spanishCards
  )
  console.log('✅ Spanish deck created:', insertedSpanishDeck.title)
  console.log(`✅ Added ${spanishCards.length} Spanish cards`)

  // Create British history deck with cards
  const historyCards = [
    {
      front: 'When was the Battle of Hastings?',
      back: '1066',
    },
    {
      front: 'Who was the first Tudor monarch?',
      back: 'Henry VII',
    },
    {
      front: 'In which year did the Great Fire of London occur?',
      back: '1666',
    },
    {
      front: 'When did World War I begin?',
      back: '1914',
    },
    {
      front: 'When did World War II end?',
      back: '1945',
    },
    {
      front: 'Who was the "Iron Lady"?',
      back: 'Margaret Thatcher',
    },
    {
      front: 'Which king had six wives?',
      back: 'Henry VIII',
    },
    {
      front: 'When did the English Civil War begin?',
      back: '1642',
    },
    {
      front: 'Who was the longest-reigning British monarch before Elizabeth II?',
      back: 'Queen Victoria',
    },
    {
      front: 'In which year did the Battle of Waterloo take place?',
      back: '1815',
    },
    {
      front: 'When did the Industrial Revolution begin in Britain?',
      back: 'Mid-18th century (around 1760)',
    },
    {
      front: 'Who led Britain during most of World War II?',
      back: 'Winston Churchill',
    },
    {
      front: 'When did the Norman Conquest of England occur?',
      back: '1066',
    },
    {
      front: 'Which act united England and Scotland?',
      back: 'The Act of Union (1707)',
    },
    {
      front: 'When did the British Empire reach its peak?',
      back: 'Early 20th century (around 1920)',
    },
  ]

  const insertedHistoryDeck = await createDeckWithCards(
    userId,
    {
      title: 'British History',
      description: 'Important dates, events, and facts about British history',
    },
    historyCards
  )
  console.log('✅ British History deck created:', insertedHistoryDeck.title)
  console.log(`✅ Added ${historyCards.length} British History cards`)

  console.log('\n🎉 Successfully created both decks with cards!')
  console.log(`   - Spanish deck: ${spanishCards.length} cards`)
  console.log(`   - British History deck: ${historyCards.length} cards`)
}

main().catch(console.error)

