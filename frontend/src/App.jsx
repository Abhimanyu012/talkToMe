import React, { useState } from 'react'

const App = () => {
  const [mode, setMode] = useState('light')
  const isDark = mode === 'dark'

  const rootBg = isDark
    ? 'bg-gradient-to-br from-blue-950 via-black to-emerald-950 text-gray-100'

    : 'bg-gradient-to-br from-blue-300 via-white to-emerald-200 text-gray-900'

  const glassCard = isDark
    ? 'bg-white/6 border border-white/10 shadow-lg text-gray-100'
    : // lighter, more translucent frosted look for light mode
    'bg-white/30 backdrop-blur-sm backdrop-saturate-105 border border-white/20 shadow-sm text-gray-900'

  const headerGlass = isDark
    ? 'bg-white/6 border border-white/8'
    : // softer glass header in light mode
    'bg-white/20 backdrop-blur-md backdrop-saturate-105 border border-white/15'

  const accent = isDark ? 'from-indigo-500 to-purple-600' : 'from-indigo-600 to-indigo-400'

  return (
    <div className={`min-h-screen ${rootBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className={` backdrop-blur-md shadow-sm ${headerGlass} rounded-xl p-4 mb-8 transition-colors`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`h-10 w-10 rounded flex items-center justify-center font-bold bg-clip-padding bg-linear-to-br ${accent} text-white`}
                aria-hidden
              >
                TT
              </div>
              <span className="text-lg font-semibold">TalkToMe</span>
            </div>

            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <a className="hover:underline" href="#">
                Home
              </a>
              <a className="hover:underline" href="#">
                Features
              </a>
              <a className="hover:underline" href="#">
                Pricing
              </a>
              <a className="hover:underline" href="#">
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <button
                className={`hidden md:inline-flex px-4 py-2 rounded-md font-medium transition ${isDark ? 'bg-indigo-600/90 hover:bg-indigo-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                Get Started
              </button>

              <button
                onClick={() => setMode(isDark ? 'light' : 'dark')}
                className="p-2 rounded-md hover:bg-white/10 transition"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m8.66-12.34l-.7.7M4.34 19.66l-.7.7M21 12h-1M4 12H3m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    />
                  </svg>
                )}
              </button>

              <div className="md:hidden">
                <button className="p-2 rounded-md text-gray-400 hover:bg-white/5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className={`rounded-xl p-8 ${glassCard} backdrop-blur-md transition`}>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Build modern glassy UIs with Tailwind
              </h1>
              <p className="mt-4 text-sm text-opacity-90">
                Clean glassmorphism styles with light and dark modes — subtle blur, soft borders and vibrant accents.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <button
                  className={`px-5 py-3 rounded-md font-medium transition ${isDark ? 'bg-white/10 text-white hover:bg-white/12' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  Primary Action
                </button>
                <button
                  className={`px-5 py-3 rounded-md border transition ${isDark ? 'border-white/10 text-white/90 bg-white/3 hover:bg-white/5' : 'border-white/30 bg-white/50 hover:bg-white/60'
                    }`}
                >
                  Secondary
                </button>
              </div>
            </div>

            <div className={`rounded-xl p-6 ${glassCard} backdrop-blur-md transition`}>
              <div
                className={`h-56 rounded-md flex items-center justify-center font-semibold bg-linear-to-br ${accent} bg-clip-padding text-white`}
              >
                Illustration / Preview
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold">Features</h2>
            <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className={`p-6 rounded-lg ${glassCard} backdrop-blur-sm`}>
                <h3 className="text-lg font-medium">Glassy Layers</h3>
                <p className="mt-2 text-sm text-opacity-90">Soft blur, translucent surfaces and subtle borders for depth.</p>
              </div>

              <div className={`p-6 rounded-lg ${glassCard} backdrop-blur-sm`}>
                <h3 className="text-lg font-medium">Responsive</h3>
                <p className="mt-2 text-sm text-opacity-90">Layouts adapt smoothly across screen sizes using Tailwind utilities.</p>
              </div>

              <div className={`p-6 rounded-lg ${glassCard} backdrop-blur-sm`}>
                <h3 className="text-lg font-medium">Accessible</h3>
                <p className="mt-2 text-sm text-opacity-90">High contrast modes and clean semantics for better accessibility.</p>
              </div>
            </div>
          </section>
        </main>

        <footer className={`mt-12 rounded-xl p-4 ${glassCard} backdrop-blur-md flex flex-col sm:flex-row justify-between items-center text-sm`}>
          <p>© {new Date().getFullYear()} TalkToMe. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <a className="hover:underline" href="#">
              Privacy
            </a>
            <a className="hover:underline" href="#">
              Terms
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App