import { Home, Plus, Search } from 'lucide-react'
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

        <div className="relative -top-8 flex flex-col items-center">
          <Link
            to="/audio/create"
            className="bg-primary-gradient block rounded-full p-4 shadow-lg transition-colors duration-200"
          >
            <Plus className="h-8 w-8 text-white" strokeWidth={2} />
          </Link>
          <span className="text-md mt-1 text-gray-800">投稿</span>
        </div>

        <Link
          to="/audio"
          className="block flex-1 px-2 py-3 text-center hover:bg-gray-50"
        >
          <Search className="mx-auto mb-1 h-6 w-6 text-gray-500" />
          <span className="text-md text-gray-800">検索</span>
        </Link>
      </div>
    </nav>
  )
}

export default Footer
