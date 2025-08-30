import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Volume2 } from 'lucide-react'
import { getPosts, type Post } from '@/lib/api'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const [femaleStats, setFemaleStats] = useState<Post[]>([])
  const [maleStats, setMaleStats] = useState<Post[]>([])
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    setLoading(true)

    try {
      // 並列で3つのAPIリクエストを実行
      const [femaleResult, maleResult, latestResult] = await Promise.all([
        getPosts({ page: 1, gender: 'female' }), // 女性の投稿5件
        getPosts({ page: 1, gender: 'male' }), // 男性の投稿5件
        getPosts({ page: 1 }), // 最新投稿10件
      ])

      if (femaleResult.success) {
        setFemaleStats(femaleResult.posts.slice(0, 5))
      }
      if (maleResult.success) {
        setMaleStats(maleResult.posts.slice(0, 5))
      }
      if (latestResult.success) {
        setLatestPosts(latestResult.posts.slice(0, 10))
      }
    } catch (error) {
      console.error('データ取得エラー:', error)
    } finally {
      setLoading(false)
    }
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
      ? 'border-l-4 border-l-blue-500'
      : 'border-l-4 border-l-pink-500'
  }

  const PostCard: React.FC<{ post: Post }> = ({ post }) => (
    <Link to={`/audio/${post.id}`}>
      <Card
        className={`w-full cursor-pointer transition-shadow hover:shadow-md ${getGenderBorderColor(post.gender)}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 truncate text-base font-semibold">
                {post.title}
              </h3>
              <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                <span>
                  {post.xId ? `@${post.xId}` : '名無しのオホゴエニスト'}
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
  )

  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-xl font-bold">{title}</h2>
  )

  const MoreLink: React.FC<{
    linkTo: string
    linkParams?: Record<string, string>
  }> = ({ linkTo, linkParams }) => (
    <div className="flex justify-end pt-2">
      <Link
        to={
          linkParams ? `${linkTo}?${new URLSearchParams(linkParams)}` : linkTo
        }
        className="group flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        もっとみる
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      {/* ヘッダー */}
      <div className="space-y-4 text-center">
        <div className="flex justify-center space-x-4">
          <Link to="/audio/create">
            <Button className="bg-primary-gradient cursor-pointer">
              <Volume2 className="mr-2 h-4 w-4 text-white" />
              <span className="text-white">音声を投稿する</span>
            </Button>
          </Link>
          <Link to="/audio">
            <Button
              className="cursor-pointer hover:bg-current hover:text-current hover:opacity-100 hover:shadow-none"
              variant="outline"
            >
              すべての投稿を見る
            </Button>
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <SectionTitle title="女性の投稿" />
        {femaleStats.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            女性の投稿がまだありません
          </p>
        ) : (
          <div className="space-y-2">
            <div className="grid gap-4 md:grid-cols-1">
              {femaleStats.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <MoreLink linkTo="/audio" linkParams={{ gender: 'female' }} />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <SectionTitle title="男性の投稿" />
        {maleStats.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            男性の投稿がまだありません
          </p>
        ) : (
          <div className="space-y-2">
            <div className="grid gap-4 md:grid-cols-1">
              {maleStats.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <MoreLink linkTo="/audio" linkParams={{ gender: 'male' }} />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <SectionTitle title="最新投稿" />
        {latestPosts.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            投稿がまだありません
          </p>
        ) : (
          <div className="space-y-2">
            <div className="grid gap-4 md:grid-cols-1">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <MoreLink linkTo="/audio" />
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
