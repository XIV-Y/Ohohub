// src/components/custom-ui/Footer.tsx
import { Home, Plus, Search, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <nav className="fixed bottom-0 w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-lg items-center">
        <Link
          to="/"
          className="block flex-1 px-2 py-3 text-center hover:bg-gray-50"
        >
          <Home className="mx-auto mb-1 h-6 w-6 text-gray-500" />
          <span className="text-md text-gray-800">ホーム</span>
        </Link>

        <Link
          to="/audio/create"
          className="block flex-1 px-2 py-3 text-center hover:bg-gray-50"
        >
          <Plus className="mx-auto mb-1 h-6 w-6 text-gray-500" />
          <span className="text-md text-gray-800">投稿</span>
        </Link>

        <Link
          to="/audio"
          className="block flex-1 px-2 py-3 text-center hover:bg-gray-50"
        >
          <Search className="mx-auto mb-1 h-6 w-6 text-gray-500" />
          <span className="text-md text-gray-800">検索</span>
        </Link>

        <Link
          to="/bookmarks"
          className="block flex-1 px-2 py-3 text-center hover:bg-gray-50"
        >
          <Bookmark className="mx-auto mb-1 h-6 w-6 text-gray-500" />
          <span className="text-md text-gray-800">ブックマーク</span>
        </Link>
      </div>
    </nav>
  )
}

export default Footer
