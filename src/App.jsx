import { useState } from 'react'
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

function App() {
  const [currentPage, setCurrentPage] = useState('home')

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
