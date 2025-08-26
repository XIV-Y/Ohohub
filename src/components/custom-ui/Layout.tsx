import { Outlet } from 'react-router-dom'

import { ThemeProvider } from '@/providers/theme'

import Header from '@/components/custom-ui/header'
import Footer from '@/components/custom-ui/Footer'

const Layout = () => {
  return (
    <ThemeProvider>
      <div className="bg-primary-origin min-h-screen w-full">
        <Header />
        <main className="bg-card mx-auto w-full max-w-lg p-4 pt-10 pb-30">
          <div className="mx-auto min-h-screen w-full">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default Layout
