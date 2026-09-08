import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const { user } = useAuth()

  return user ? <Home /> : <Login />
}
