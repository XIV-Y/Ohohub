import { Route, Routes } from 'react-router-dom'

import Home from '@/pages/Home'
import NotFound from '@/pages/errors/NotFound'
import Layout from '@/components/custom-ui/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
