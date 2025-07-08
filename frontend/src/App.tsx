import { useEffect, useState } from 'react'
import axios from 'axios'

interface Url {
  id: string
  originalUrl: string
  shortCode: string
  accessCount: number
  createdAt: string
}

export default function App() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [urls, setUrls] = useState<Url[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchUrls() {
    try {
      const response = await axios.get('http://localhost:3333/urls')
      setUrls(response.data)
    } catch {
      setError('Erro ao carregar URLs.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!originalUrl.trim()) return

    setLoading(true)
    try {
      await axios.post('http://localhost:3333/urls', { originalUrl })
      setOriginalUrl('')
      await fetchUrls()
    } catch {
      setError('Erro ao encurtar URL')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUrls()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-blue-50 to-green-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-700">
          🔗 Encurtador de URLs
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex gap-4 flex-col sm:flex-row"
          aria-label="Formulário para encurtar URL"
        >
          <input
            type="text"
            placeholder="Cole sua URL aqui"
            className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            disabled={loading}
            aria-label="URL original"
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={loading}
            aria-label="Encurtar URL"
          >
            {loading ? 'Encurtando...' : 'Encurtar'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            URLs Encurtadas
          </h2>

          {urls.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma URL encurtada ainda.</p>
          ) : (
            <ul className="space-y-5 max-h-[400px] overflow-y-auto">
              {urls.map(({ id, originalUrl, shortCode, accessCount }) => (
                <li
                  key={id}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-500 mb-1">Original:</p>
                  <a
                    href={originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-medium underline break-words"
                  >
                    {originalUrl}
                  </a>

                  <p className="mt-3 text-sm">
                    🔗 Encurtada:{' '}
                    <a
                      href={`http://localhost:3333/${shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-semibold underline"
                    >
                      http://localhost:3333/{shortCode}
                    </a>
                  </p>

                  <p className="mt-1 text-xs text-gray-400">Acessos: {accessCount}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
