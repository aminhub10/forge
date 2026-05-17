import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-4xl font-bold mb-4">⚒️ Forge</h1>
        <p className="text-zinc-500 mb-8">Crée tes apps avec l'IA</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Se connecter
          </Link>
          <Link href="/signup" className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  )
}