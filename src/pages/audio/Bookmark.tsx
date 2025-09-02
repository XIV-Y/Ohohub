// src/pages/audio/Bookmarks.tsx
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getBookmarksPaginated, type BookmarkItem } from '@/utils/bookmarkUtils'

const BookmarksPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    fetchBookmarksData(currentPage)
  }, [currentPage])

  const fetchBookmarksData = (page: number) => {
    setLoading(true)

    try {
      const result = getBookmarksPaginated(page, 15)

      setBookmarks(result.bookmarks)
      setCurrentPage(result.pagination.currentPage)
      setTotalPages(result.pagination.totalPages)
      setTotalItems(result.pagination.totalItems)
    } catch (error) {
      console.error('ブックマーク取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatRelativeTime = (dateString: string): string => {
    const now = new Date()
    const bookmarkDate = new Date(dateString)
    const diffInMs = now.getTime() - bookmarkDate.getTime()
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
    <div className="mx-auto max-w-4xl space-y-6 px-6 pb-10">
      <div className="space-y-2 text-center">
        <h1 className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Bookmark className="h-6 w-6" />
          ブックマーク一覧
        </h1>
      </div>

      {/* ブックマーク一覧 */}
      {loading ? (
        <div className="py-8 text-center">読み込み中...</div>
      ) : bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">
              ブックマークが見つかりませんでした
            </h3>
            <Link to="/audio">
              <Button variant="outline">音声投稿を探す</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="space-y-4">
              <Link to={`/audio/${bookmark.id}`}>
                <Card
                  className={`w-full cursor-pointer transition-shadow hover:shadow-md ${getGenderBorderColor(bookmark.gender)}`}
                >
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 truncate text-lg font-semibold">
                          {bookmark.title}
                        </h3>
                        <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                          <span>
                            {bookmark.xId
                              ? `@${bookmark.xId}`
                              : '名無しのオホゴエニスト'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">
                          投稿: {formatRelativeTime(bookmark.createdAt)}
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

export default BookmarksPage
