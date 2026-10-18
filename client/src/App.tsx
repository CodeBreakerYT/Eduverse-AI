import { Navigate, Route, Routes } from 'react-router-dom'
import { useUserStore } from './store/useUserStore'
import WorldShell from './components/layout/WorldShell'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import WorldHome from './pages/WorldHome'
import Subjects from './pages/Subjects'
import Explore from './pages/Explore'
import Practice from './pages/Practice'
import AITutor from './pages/AITutor'
import Recommendations from './pages/Recommendations'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import MathWorld from './pages/subjects/MathWorld'
import PhysicsWorld from './pages/subjects/PhysicsWorld'
import ChemistryWorld from './pages/subjects/ChemistryWorld'
import BiologyWorld from './pages/subjects/BiologyWorld'
import HistoryWorld from './pages/subjects/HistoryWorld'
import GeographyWorld from './pages/subjects/GeographyWorld'
import CSWorld from './pages/subjects/CSWorld'
import SortingArena from './pages/subjects/SortingArena'
import GraphLab from './pages/subjects/GraphLab'
import Games from './pages/Games'
import SortRush from './pages/games/SortRush'
import MathRunner from './pages/games/MathRunner'
import QuizBlitz from './pages/games/QuizBlitz'
import GraphQuest from './pages/games/GraphQuest'

function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const done = useUserStore((s) => s.profile.onboardingComplete)
  if (!done) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* WorldShell keeps the 3D hub mounted at all times; every other page
          renders as a floating bubble window on top of it via <Outlet />. */}
      <Route
        element={
          <RequireOnboarding>
            <WorldShell />
          </RequireOnboarding>
        }
      >
        <Route path="/world" element={<WorldHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/sort-rush" element={<SortRush />} />
        <Route path="/games/math-runner" element={<MathRunner />} />
        <Route path="/games/quiz-blitz" element={<QuizBlitz />} />
        <Route path="/games/graph-quest" element={<GraphQuest />} />
        <Route path="/tutor" element={<AITutor />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/world/math" element={<MathWorld />} />
        <Route path="/world/physics" element={<PhysicsWorld />} />
        <Route path="/world/chemistry" element={<ChemistryWorld />} />
        <Route path="/world/biology" element={<BiologyWorld />} />
        <Route path="/world/history" element={<HistoryWorld />} />
        <Route path="/world/geography" element={<GeographyWorld />} />
        <Route path="/world/cs" element={<CSWorld />} />
        <Route path="/world/cs/sorting" element={<SortingArena />} />
        <Route path="/world/cs/graph" element={<GraphLab />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
