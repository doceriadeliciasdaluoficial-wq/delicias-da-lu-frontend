import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SiteDataProvider } from './context/SiteDataContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteDataProvider>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </SiteDataProvider>
  </React.StrictMode>,
)
