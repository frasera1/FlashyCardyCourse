# AI Flashcard Generation Feature

This document describes the AI-powered flashcard generation feature that was added to the application.

## Overview

Users can now generate flashcards automatically using AI based on their deck's title and description. This feature is restricted to users with the Pro plan or those who have the `ai_flashcard_generation` feature enabled.

## Features

- **Automatic Generation**: Generates 20 flashcards based on deck title and description
- **Description Required**: Deck must have both a title and description for AI generation
- **Pro Feature**: Only available to Pro subscribers or users with the AI generation feature
- **Smart Prompting**: Uses OpenAI's GPT-4o-mini model to create educational, well-structured flashcards
- **Access Control**: Free users see a tooltip and are redirected to the pricing page

## Files Created/Modified

### New Files

1. **`src/app/actions/ai-actions.ts`**
   - Server action for AI flashcard generation
   - Validates user authentication and feature access
   - Calls OpenAI API to generate flashcards
   - Saves generated cards to the database

2. **`src/app/decks/[deckId]/generate-ai-cards-button.tsx`**
   - Client component for the AI generation button
   - Checks user's feature access using Clerk's `has()` method
   - Shows tooltip for free users
   - Redirects to pricing page if clicked without access
   - Calls the AI generation server action for Pro users

3. **`src/components/ui/tooltip.tsx`**
   - shadcn/ui Tooltip component (installed via CLI)
   - Used to inform free users about the Pro feature

### Modified Files

1. **`src/app/decks/[deckId]/page.tsx`**
   - Added the `GenerateAICardsButton` component to the deck header
   - Positioned between the Study button and Create Card dialog

2. **`package.json`**
   - Added dependencies: `ai` and `@ai-sdk/openai`

## How It Works

### For Decks Without Description

1. User sees a disabled button with an AlertCircle icon
2. Hovering shows a tooltip: "Add a description to this deck to use AI generation."
3. Clicking the button shows an error toast prompting to add a description first
4. User must edit the deck to add a description before using AI generation

### For Pro Users (with Description)

1. User clicks the "Generate Cards with AI" button
2. System validates user has the `ai_flashcard_generation` feature
3. System validates deck has both title and description
4. AI generates 20 flashcards based on deck title and description
5. Cards are automatically saved to the deck
6. User sees a success toast notification
7. Page automatically updates with new cards

### For Free Users (with Description)

1. User sees the "Generate Cards with AI" button with a Sparkles icon
2. Hovering shows a tooltip: "This is a Pro feature. Click to view pricing and upgrade."
3. Clicking the button redirects to `/pricing` page
4. User can upgrade to Pro to access the feature

## Environment Variables

Add the following to your `.env.local` file:

```bash
# OpenAI API (Required for AI Flashcard Generation)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Override the default OpenAI model (default: gpt-4o-mini)
# Options: gpt-4o, gpt-4o-mini, gpt-3.5-turbo
OPENAI_MODEL=gpt-4o-mini
```

## Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys in your account settings
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

**Important**: Never commit your API key to version control. The `.env.local` file is already in `.gitignore`.

## Clerk Billing Configuration

### Required Feature Setup

In your [Clerk Dashboard](https://dashboard.clerk.com/~/billing/plans), ensure you have:

1. **Plan: `pro`** - Premium tier with full feature access
2. **Feature: `ai_flashcard_generation`** - Enables AI-powered flashcard generation

The feature should be assigned to the `pro` plan.

### Testing Locally

In development, you can test the feature by:

1. Using Clerk's development gateway (shared test Stripe account)
2. Manually assigning the `ai_flashcard_generation` feature to test users in the Clerk Dashboard

## Technical Details

### AI Generation

- **Model**: `gpt-4o-mini` (fast and cost-effective)
- **Card Count**: Exactly 20 cards per generation
- **Prompt Engineering**: Structured prompt ensures educational, clear flashcards
- **Validation**: Zod schemas ensure type-safe AI outputs

### Security & Validation

- ✅ Authentication checked via `auth()` from Clerk
- ✅ Feature access verified using `has({ feature: 'ai_flashcard_generation' })`
- ✅ Deck ownership verified before generation
- ✅ Description required validation (client and server-side)
- ✅ Server-side validation prevents unauthorized access
- ✅ API key stored securely in environment variables

### Error Handling

The system handles:
- Missing OpenAI API key
- Rate limiting errors
- Feature access denial
- Invalid deck access
- AI generation failures

All errors show user-friendly toast notifications.

## Cost Considerations

### OpenAI Costs

- **Model**: `gpt-4o-mini` is chosen for cost-effectiveness
- **Cost per Generation**: Approximately $0.01-0.03 per 20-card generation
- **Optimization**: Consider adding rate limiting for production use

### Clerk Billing

- **Transaction Fee**: 0.7% per subscription transaction
- **Stripe Fees**: Standard Stripe transaction fees apply
- **No Setup Fee**: Free to implement

## Future Enhancements

Potential improvements:

1. **Custom Card Count**: Allow users to specify 5-50 cards
2. **Topic Refinement**: Let users add specific topics or focus areas
3. **Difficulty Levels**: Generate cards at different difficulty levels
4. **Language Support**: Generate cards in different languages
5. **Batch Generation**: Generate cards for multiple decks at once
6. **Regeneration**: Allow users to regenerate individual cards
7. **Rate Limiting**: Add per-user generation limits

## Troubleshooting

### Button Not Working

1. **Check if deck has a description** - Button will be disabled without one
2. Verify OpenAI API key is set in `.env.local`
3. Check Clerk Dashboard for feature configuration
4. Ensure user has Pro plan or `ai_flashcard_generation` feature
5. Check browser console for errors
6. Verify server action permissions

### Cards Not Generating

1. Check OpenAI API key is valid and has credits
2. Verify network connectivity to OpenAI API
3. Check server logs for detailed error messages
4. Ensure deck ownership is correct

### Tooltip Not Showing

1. Verify tooltip component was installed correctly
2. Check that shadcn/ui is configured properly
3. Ensure Radix UI dependencies are installed

## References

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Clerk Billing Documentation](https://clerk.com/docs/guides/billing/for-b2c)
- [shadcn/ui Tooltip](https://ui.shadcn.com/docs/components/tooltip)
