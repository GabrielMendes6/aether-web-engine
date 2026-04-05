import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoutes from './Routes/AppRoutes.jsx'
import { AuthProvider } from './Context/AuthProvider.jsx'
import './index.css' // Importante para o Tailwind!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>,
)
