import { Route, Routes } from 'react-router-dom'

import Home from '@/pages/Home'
import NotFound from '@/pages/errors/NotFound'
import AudioCreate from '@/pages/audio/Create'
import Layout from '@/components/custom-ui/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/audio/create" element={<AudioCreate />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
