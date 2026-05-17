'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="24" height="24" rx="6" fill="#4f98a3" fillOpacity="0.2"/>
              <path d="M10 16l4 4 8-8" stroke="#4f98a3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="4" y="4" width="24" height="24" rx="6" stroke="#4f98a3" strokeWidth="1.5"/>
            </svg>
            <span className="text-white font-bold text-xl tracking-tight">BuilderAI</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Bon retour 👋</h1>
          <p className="text-zinc-500 text-sm">Connecte-toi pour accéder à tes projets</p>
        </div>

        {/* Form */}
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-zinc-400 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="toi@email.com"
                required
                className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

          </form>
        </div>

        <p className="text-center text-zinc-600 text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-teal-500 hover:text-teal-400 font-medium transition-colors">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  )
}