import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import {
  SignInButton,
  SignUpButton,
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const { userId } = await auth()

  // Redirect logged-in users to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold text-foreground">FlashyCardy</h1>
          <h2 className="text-xl text-muted-foreground">
            Your personal flashcard platform
          </h2>
        </div>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </div>
      </main>
    </div>
  )
}
