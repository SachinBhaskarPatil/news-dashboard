'use client'

import { useEffect, useState } from 'react'

export default function TestConfig() {
  const [config, setConfig] = useState({
    hasGoogleId: false,
    hasGoogleSecret: false,
    hasNextAuthUrl: false,
    hasNextAuthSecret: false,
  })

  useEffect(() => {
    // Check if environment variables are loaded
    setConfig({
      hasGoogleId: !!process.env.NEXT_PUBLIC_GOOGLE_ID,
      hasGoogleSecret: !!process.env.NEXT_PUBLIC_GOOGLE_SECRET,
      hasNextAuthUrl: !!process.env.NEXT_PUBLIC_NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    })
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Configuration Test</h1>
      <div className="space-y-2">
        <p>Google ID configured: {config.hasGoogleId ? '✅' : '❌'}</p>
        <p>Google Secret configured: {config.hasGoogleSecret ? '✅' : '❌'}</p>
        <p>NextAuth URL configured: {config.hasNextAuthUrl ? '✅' : '❌'}</p>
        <p>NextAuth Secret configured: {config.hasNextAuthSecret ? '✅' : '❌'}</p>
      </div>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Required Environment Variables:</h2>
        <pre className="text-sm">
{`NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret`}
        </pre>
      </div>
    </div>
  )
} 