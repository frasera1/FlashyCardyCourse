import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AppHeaderProps {
  showPricingLink?: boolean
}

export async function AppHeader({ showPricingLink = true }: AppHeaderProps) {
  const { userId, has } = await auth()

  // Check if user has Pro plan
  const hasUnlimitedDecks = has({ feature: 'unlimited_decks' })
  const currentPlan = hasUnlimitedDecks ? 'Pro' : 'Free'
  const planVariant = hasUnlimitedDecks ? 'default' : 'secondary'

  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold text-foreground cursor-pointer hover:opacity-80 transition-opacity">
            Flashy Cardy Course
          </h1>
        </Link>
        {userId && (
          <div className="flex items-center gap-4">
            <Badge variant={planVariant} className="text-xs">
              {currentPlan}
            </Badge>
            {showPricingLink && (
              <Link href="/pricing">
                <Button variant="ghost" size="sm">
                  {hasUnlimitedDecks ? 'Manage Plan' : 'Upgrade'}
                </Button>
              </Link>
            )}
            <UserButton />
          </div>
        )}
      </div>
    </header>
  )
}
