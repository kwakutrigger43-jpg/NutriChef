import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { RecipeProvider } from './context/RecipeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RecipeProvider>
        <App />
      </RecipeProvider>
    </AuthProvider>
  </StrictMode>,
)
