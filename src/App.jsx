import { useEffect, useState } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import CartSidebar from './components/CartSidebar'
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import OrderBuilder from './pages/OrderBuilder'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import AdminPanel from './pages/AdminPanel'

const ADMIN_PATH = '/painel-interno-secreto-lu'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAdminRoute, setIsAdminRoute] = useState(() =>
    window.location.pathname.startsWith(ADMIN_PATH)
  )

  useEffect(() => {
    const syncRoute = () => {
      setIsAdminRoute(window.location.pathname.startsWith(ADMIN_PATH))
    }

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const leaveAdmin = () => {
    window.history.pushState({}, '', '/')
    setIsAdminRoute(false)
    setCurrentPage('home')
    window.scrollTo(0, 0)
  }

  if (isAdminRoute) {
    return <AdminPanel onExit={leaveAdmin} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />
      case 'menu':
        return <Menu setCurrentPage={setCurrentPage} />
      case 'order-builder':
        return <OrderBuilder setCurrentPage={setCurrentPage} />
      case 'about':
        return <AboutUs setCurrentPage={setCurrentPage} />
      case 'contact':
        return <Contact setCurrentPage={setCurrentPage} />
      default:
        return <Home setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-on-background antialiased flex flex-col">
        <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
        <CartSidebar />
        <div className="flex-1">
          {renderPage()}
        </div>
        <Footer />
        <FloatingWhatsAppButton />
      </div>
    </CartProvider>
  )
}

export default App
