import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { getPosts, type Post } from '../../lib/api'
import { Link } from 'react-router-dom'

const AudioSearch: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // 検索フィルター
  const [searchTitle, setSearchTitle] = useState('')
  const [searchXId, setSearchXId] = useState('')
  const [searchGender, setSearchGender] = useState('')

  // 実際に送信される検索条件
  const [appliedFilters, setAppliedFilters] = useState({
    postTitle: '',
    xId: '',
    gender: '',
  })

  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage, appliedFilters])

  const fetchPosts = async (page: number) => {
    setLoading(true)
    const result = await getPosts({
      page,
      ...appliedFilters,
    })

    if (result.success) {
      setPosts(result.posts)
      setCurrentPage(result.pagination.currentPage)
      setTotalPages(result.pagination.totalPages)
      setTotalItems(result.pagination.totalItems)
    }
    setLoading(false)
  }

  const handleSearch = () => {
    setAppliedFilters({
      postTitle: searchTitle,
      xId: searchXId,
      gender: searchGender,
    })
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchTitle('')
    setSearchXId('')
    setSearchGender('')
    setAppliedFilters({
      postTitle: '',
      xId: '',
      gender: '',
    })
    setCurrentPage(1)
  }

  const formatRelativeTime = (dateString: string): string => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInMs = now.getTime() - postDate.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return '今日'
    if (diffInDays === 1) return '1日前'
    if (diffInDays < 7) return `${diffInDays}日前`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}週間前`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}ヶ月前`
    return `${Math.floor(diffInDays / 365)}年前`
  }

  const getGenderBorderColor = (gender: 'male' | 'female'): string => {
    return gender === 'male'
      ? 'border-l-5 border-l-blue-500'
      : 'border-l-5 border-l-pink-500'
  }

  const renderPagination = () => {
    const pages = []
    const showPages = 5
    const startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    const endPage = Math.min(totalPages, startPage + showPages - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      )
    }

    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xls mx-auto space-y-6 px-6 pb-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">音声投稿一覧</h1>
      </div>

      {/* 検索フィルター */}
      <Card>
        <CardContent className="px-6 py-1">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Xアカウント
              </label>
              <Input
                placeholder="@なしで入力"
                value={searchXId}
                onChange={(e) => setSearchXId(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">性別</label>
              <Select value={searchGender} onValueChange={setSearchGender}>
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end space-x-2">
              <Button
                onClick={handleSearch}
                className="bg-primary-gradient flex-1"
              >
                <Search className="mr-2 h-4 w-4 text-white" />
                <p className="text-white">検索</p>
              </Button>
              <Button variant="outline" onClick={handleClearSearch}>
                クリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 投稿一覧 */}
      {loading ? (
        <div className="py-8 text-center">読み込み中...</div>
      ) : posts.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          投稿が見つかりませんでした
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="space-y-4">
              <Link to={`/audio/${post.id}`}>
                <Card
                  className={`w-full cursor-pointer transition-shadow hover:shadow-md ${getGenderBorderColor(post.gender)}`}
                >
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 truncate text-lg font-semibold">
                          {post.title}
                        </h3>
                        <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                          <span>
                            {post.xId
                              ? `@${post.xId}`
                              : '名無しのオホゴエニスト'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">
                          {formatRelativeTime(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ページネーション */}
      {totalPages > 1 && <div className="space-y-4">{renderPagination()}</div>}
    </div>
  )
}

export default AudioSearch
