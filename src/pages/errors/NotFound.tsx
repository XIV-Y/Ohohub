import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-4">
        <div className="text-muted-foreground/100 text-8xl font-bold">404</div>
        <h1 className="text-foreground text-2xl font-semibold">
          ページが見つかりません
        </h1>
        <p className="text-muted-foreground max-w-md">
          お探しのページは存在しないか、削除された可能性があります。
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardContent className="space-y-3 p-4">
          <Button onClick={handleGoHome} className="w-full" size="lg">
            <Home className="mr-2 h-4 w-4" />
            ホームに戻る
          </Button>

          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            前のページに戻る
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
