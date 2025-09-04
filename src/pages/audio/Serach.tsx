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
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

const AudioSearch: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // 検索フィルター（フォーム入力値）
  const [searchTitle, setSearchTitle] = useState('')
  const [searchXId, setSearchXId] = useState('')
  const [searchGender, setSearchGender] = useState('')

  // URLのクエリパラメータを管理
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // 実際に送信される検索条件
  const [appliedFilters, setAppliedFilters] = useState({
    postTitle: '',
    xId: '',
    gender: '',
  })

  // 初回読み込み時にURLパラメータから状態を復元
  useEffect(() => {
    const pageParam = searchParams.get('page')
    const titleParam = searchParams.get('title') || ''
    const xIdParam = searchParams.get('xId') || ''
    const genderParam = searchParams.get('gender') || ''

    // フォーム入力値を設定
    setSearchTitle(titleParam)
    setSearchXId(xIdParam)
    setSearchGender(genderParam)

    // 適用された検索条件を設定
    setAppliedFilters({
      postTitle: titleParam,
      xId: xIdParam,
      gender: genderParam,
    })

    // ページを設定
    const page = pageParam ? parseInt(pageParam, 10) : 1
    setCurrentPage(page)

    // 初期データを取得
    fetchPosts(page, {
      postTitle: titleParam,
      xId: xIdParam,
      gender: genderParam,
    })
  }, [])

  // appliedFiltersまたはcurrentPageが変更されたときにデータを取得
  useEffect(() => {
    // 初回読み込み判定のためのフラグを追加
    const isInitialLoad =
      currentPage === 1 &&
      !appliedFilters.postTitle &&
      !appliedFilters.xId &&
      !appliedFilters.gender &&
      !searchParams.get('page') &&
      !searchParams.get('title') &&
      !searchParams.get('xId') &&
      !searchParams.get('gender')

    if (isInitialLoad) {
      return
    }
    fetchPosts(currentPage, appliedFilters)
  }, [currentPage, appliedFilters])

  const fetchPosts = async (page: number, filters = appliedFilters) => {
    setLoading(true)
    const result = await getPosts({
      page,
      ...filters,
    })

    if (result.success) {
      setPosts(result.posts)
      setCurrentPage(result.pagination.currentPage)
      setTotalPages(result.pagination.totalPages)
      setTotalItems(result.pagination.totalItems)
    }
    setLoading(false)
  }

  // URLパラメータを更新する関数
  const updateUrlParams = (page: number, filters: typeof appliedFilters) => {
    const params = new URLSearchParams()

    if (page > 1) {
      params.set('page', page.toString())
    }
    if (filters.postTitle) {
      params.set('title', filters.postTitle)
    }
    if (filters.xId) {
      params.set('xId', filters.xId)
    }
    if (filters.gender) {
      params.set('gender', filters.gender)
    }

    // URLを更新
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    navigate(`/audio${newUrl}`, { replace: false })
  }

  const handleSearch = () => {
    const newFilters = {
      postTitle: searchTitle,
      xId: searchXId,
      gender: searchGender,
    }

    setAppliedFilters(newFilters)
    setCurrentPage(1)
    updateUrlParams(1, newFilters)
  }

  const handleClearSearch = () => {
    setSearchTitle('')
    setSearchXId('')
    setSearchGender('')

    const clearedFilters = {
      postTitle: '',
      xId: '',
      gender: '',
    }

    setAppliedFilters(clearedFilters)
    setCurrentPage(1)
    navigate('/audio', { replace: false })
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    updateUrlParams(newPage, appliedFilters)
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
          onClick={() => handlePageChange(i)}
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
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
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
                タイトル検索
              </label>
              <Input
                placeholder="タイトルを入力"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </div>

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
