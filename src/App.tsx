import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { VoiceAgentProvider } from './lib/voiceAgent'
import { Agent } from './pages/Agent'
import { Analytics } from './pages/Analytics'
import { Editor } from './pages/Editor'
import { Home } from './pages/Home'
import { Library } from './pages/Library'
import { Settings } from './pages/Settings'

function Shell() {
  const location = useLocation()
  const hideNav = location.pathname === '/agent'

  return (
    <div className="mx-auto min-h-screen max-w-md bg-mist-50 shadow-2xl">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/library" element={<Library />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <VoiceAgentProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </VoiceAgentProvider>
  )
}
