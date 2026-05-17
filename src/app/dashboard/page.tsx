'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Project = {
  id: string
  name: string
  description: string
  created_at: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    setUserName(user.user_metadata?.full_name || user.email || 'Utilisateur')

    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    setProjects(data || [])
    setLoading(false)
  }

  async function createProject() {
    if (!newName.trim()) return
    setCreating(true)

    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('projects')
      .insert({ name: newName, description: newDesc, user_id: user?.id })
      .select()
      .single()

    if (!error && data) {
      router.push(`/dashboard/project/${data.id}`)
    }
    setCreating(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const firstName = userName.split(' ')[0]

  return (
    <div className="min-h-screen bg-[#0f0f0f]">

      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="24" rx="6" fill="#4f98a3" fillOpacity="0.2"/>
            <path d="M10 16l4 4 8-8" stroke="#4f98a3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="4" y="4" width="24" height="24" rx="6" stroke="#4f98a3" strokeWidth="1.5"/>
          </svg>
          <span className="text-white font-bold text-lg tracking-tight">Forge</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-500 text-sm">Bonjour, <span className="text-white font-medium">{firstName}</span> 👋</span>
          <button
            onClick={logout}
            className="text-zinc-500 hover:text-white text-sm transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Hero section */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold tracking-tight mb-2">
              Mes projets
            </h1>
            <p className="text-zinc-500 text-sm">
              {projects.length === 0
                ? 'Aucun projet pour l\'instant — crée le premier !'
                : `${projects.length} projet${projects.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouveau projet
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-zinc-800 rounded w-2/3 mb-3"/>
                <div className="h-3 bg-zinc-800 rounded w-full mb-2"/>
                <div className="h-3 bg-zinc-800 rounded w-1/2"/>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">⚒️</div>
            <h2 className="text-white text-xl font-bold mb-2">Ton atelier est vide</h2>
            <p className="text-zinc-500 text-sm mb-6">Crée ton premier projet et laisse l'IA construire pour toi</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Créer mon premier projet
            </button>
          </div>
        )}

        {/* Projects grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => router.push(`/dashboard/project/${project.id}`)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 text-left transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f98a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  </div>
                  <svg className="text-zinc-600 group-hover:text-zinc-400 transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm">{project.name}</h3>
                <p className="text-zinc-500 text-xs line-clamp-2 mb-4">{project.description || 'Aucune description'}</p>
                <p className="text-zinc-600 text-xs">
                  {new Date(project.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Modal création projet */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-white text-xl font-bold mb-6">Nouveau projet</h2>

            <div className="space-y-4">
              <div>
                <label className="text-zinc-400 text-sm font-medium block mb-1.5">Nom du projet</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && createProject()}
                  placeholder="Ex: Mon app de gestion"
                  autoFocus
                  className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-zinc-400 text-sm font-medium block mb-1.5">Description <span className="text-zinc-600">(optionnel)</span></label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Décris brièvement ce que fait ton app..."
                  rows={3}
                  className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setNewName(''); setNewDesc('') }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                onClick={createProject}
                disabled={creating || !newName.trim()}
                className="flex-1 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {creating ? 'Création...' : 'Créer →'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}