import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Upload, Mic } from 'lucide-react'

const AudioCreate = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      audioFile: null,
      postTitle: '',
      authorName: '',
      xId: '',
      deletePassword: '',
      allowPromotion: false,
      gender: '',
      identificationId: '',
    },
  })

  const onSubmit = (data) => {
    console.log('Form Data:', data)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('audioFile', file)
    }
  }

  return (
    <div className="space-y-6 pb-15">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-bold">音声投稿</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mic className="h-5 w-5" />
              音声ファイル
            </CardTitle>
            <CardDescription>
              アップロードする音声ファイルを選択してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="audioFile" className="cursor-pointer">
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                  <Upload className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-400">
                    MP3, WAV, M4A (最大 50MB)
                  </p>
                </div>
              </Label>
              <Input
                id="audioFile"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">投稿情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="postTitle">タイトル *</Label>
              <Input id="postTitle" {...register('postTitle')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="xId">Xアカウント</Label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">
                  @
                </span>
                <Input id="xId" className="pl-8" {...register('xId')} />
              </div>
              <p className="text-muted-foreground text-sm">
                投稿者名として扱われます。設定しない場合は「名無しのオホゴエニスト」として表示されます
              </p>
            </div>

            <div className="space-y-2">
              <Label>性別 *</Label>
              <Select onValueChange={(value) => setValue('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deletePassword">削除用パスワード *</Label>
              <Input
                id="deletePassword"
                type="password"
                {...register('deletePassword')}
              />
              <p className="text-muted-foreground text-sm">
                投稿を削除する際に必要となります。忘れないようにしてください
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">オプション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="allowPromotion"
                onCheckedChange={(checked) =>
                  setValue('allowPromotion', checked)
                }
              />
              <div className="space-y-1">
                <Label
                  htmlFor="allowPromotion"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ohohub公式Xでの宣伝を許可する
                </Label>
                <p className="text-muted-foreground text-sm">
                  チェックすると、公式xアカウントであなたの投稿が紹介される場合があります
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="bg-primary-gradient w-full" size="lg">
          <p className="text-lg text-white">投稿する</p>
        </Button>
      </form>
    </div>
  )
}

export default AudioCreate
