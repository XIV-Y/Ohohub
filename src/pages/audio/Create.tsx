import React, { useState, useRef, useEffect } from 'react'
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
import { Upload, Mic, Play, Pause, Trash2 } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

const AudioCreate = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      audioFile: null,
      postTitle: '',
      xId: '',
      deletePassword: '',
      allowPromotion: false,
      gender: '',
    },
  })

  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [fileError, setFileError] = useState('')
  const audioRef = useRef(null)

  const selectedFile = watch('audioFile')
  const postTitleValue = watch('postTitle')
  const xIdValue = watch('xId')
  const deletePasswordValue = watch('deletePassword')

  // バリデーションルール
  const validationRules = {
    audioFile: {
      validate: {
        required: (value) =>
          (value !== null && value !== undefined) ||
          '音声ファイルを選択してください',
        fileType: (value) => {
          if (!value) return '音声ファイルを選択してください'
          const allowedTypes = [
            'audio/mp3',
            'audio/mpeg',
            'audio/wav',
            'audio/m4a',
            'audio/mp4',
          ]
          return (
            allowedTypes.includes(value.type) ||
            'MP3、WAV、M4Aファイルのみアップロード可能です'
          )
        },
        fileSize: (value) => {
          if (!value) return '音声ファイルを選択してください'
          const maxSize = 50 * 1024 * 1024 // 50MB
          return (
            value.size <= maxSize || 'ファイルサイズは50MB以下にしてください'
          )
        },
      },
    },
    postTitle: {
      required: 'タイトルは必須です',
      maxLength: {
        value: 50,
        message: 'タイトルは50文字以下で入力してください',
      },
      pattern: {
        value: /^(?!\s*$).+/,
        message: 'タイトルは空白のみでは入力できません',
      },
    },
    xId: {
      maxLength: {
        value: 15, // Xの最大ID長
        message: 'XのIDは15文字以下で入力してください',
      },
      pattern: {
        value: /^[a-zA-Z0-9_]*$/,
        message: 'XのIDは半角英数字とアンダースコアのみ使用可能です',
      },
    },
    deletePassword: {
      required: '削除用パスワードは必須です',
      maxLength: {
        value: 50,
        message: 'パスワードは50文字以下で入力してください',
      },
      pattern: {
        value:
          /^[^\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]+$/u,
        message: 'パスワードに空白や絵文字は使用できません',
      },
    },
    gender: {
      validate: (value) => {
        if (!value || value === '') return '性別を選択してください'
        return (
          ['male', 'female'].includes(value) || '有効な性別を選択してください'
        )
      },
    },
    allowPromotion: {
      required: '宣伝許可の選択は必須です',
    },
  }

  const onSubmit = (data) => {
    // 音声ファイルの手動バリデーション
    if (!selectedFile) {
      setFileError('音声ファイルを選択してください')
      return
    }

    console.log('Form Data:', data)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    setFileError('') // エラーをリセット

    if (file) {
      // ファイルバリデーション
      const allowedTypes = [
        'audio/mp3',
        'audio/mpeg',
        'audio/wav',
        'audio/m4a',
        'audio/mp4',
      ]
      const maxSize = 50 * 1024 * 1024 // 50MB

      if (!allowedTypes.includes(file.type)) {
        setValue('audioFile', null)
        const errorMsg = 'MP3、WAV、M4Aファイルのみアップロード可能です'
        setFileError(errorMsg)
        alert(errorMsg)
        // input要素もリセット
        e.target.value = ''
        return
      }

      if (file.size > maxSize) {
        setValue('audioFile', null)
        const errorMsg = 'ファイルサイズは50MB以下にしてください'
        setFileError(errorMsg)
        alert(errorMsg)
        // input要素もリセット
        e.target.value = ''
        return
      }

      setValue('audioFile', file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
    }
  }

  const removeFile = () => {
    setValue('audioFile', null)
    setFileError('') // エラーもリセット
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    // input要素もリセット
    const fileInput = document.getElementById('audioFile')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <div className="space-y-6 pb-15">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-bold">音声投稿</h1>
      </div>

      <div className="space-y-6">
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
            <div className="space-y-4">
              {!selectedFile ? (
                <div>
                  <Label htmlFor="audioFile" className="cursor-pointer">
                    <div
                      className={`w-full rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-gray-400 ${
                        fileError
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <Upload className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        ファイルを選択またはドラッグ&ドロップ
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        MP3, WAV, M4A (最大 50MB)
                      </p>
                    </div>
                  </Label>
                  {fileError && (
                    <p className="mt-2 text-sm text-red-600">{fileError}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <Mic className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={removeFile}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {audioUrl && (
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={togglePlay}
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 rounded-full p-0"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4 text-white" />
                          ) : (
                            <Play className="h-4 w-4 text-white" />
                          )}
                        </Button>

                        <div className="flex-1">
                          <Slider
                            value={[
                              duration ? (currentTime / duration) * 100 : 0,
                            ]}
                            onValueChange={(value) => {
                              if (audioRef.current && duration) {
                                const newTime = (value[0] / 100) * duration
                                audioRef.current.currentTime = newTime
                                setCurrentTime(newTime)
                              }
                            }}
                            max={100}
                            step={0.1}
                            className="w-full"
                          />

                          <div className="mt-1 flex justify-between text-xs text-gray-500">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                      </div>

                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                      />
                    </div>
                  )}
                </div>
              )}

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
              <div className="relative">
                <Input
                  id="postTitle"
                  {...register('postTitle', validationRules.postTitle)}
                  className={`pr-12 ${
                    errors.postTitle
                      ? 'border-red-500 focus:border-red-500'
                      : ''
                  }`}
                  maxLength={50}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                  {(postTitleValue || '').length}/50
                </div>
              </div>
              {errors.postTitle && (
                <p className="text-sm text-red-600">
                  {errors.postTitle.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="xId">Xアカウント</Label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform text-gray-500">
                  @
                </span>
                <Input
                  id="xId"
                  className={`pr-12 pl-8 ${errors.xId ? 'border-red-500 focus:border-red-500' : ''}`}
                  {...register('xId', validationRules.xId)}
                  maxLength={15}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                  {(xIdValue || '').length}/15
                </div>
              </div>
              {errors.xId && (
                <p className="text-sm text-red-600">{errors.xId.message}</p>
              )}
              <p className="text-muted-foreground text-sm">
                投稿者名として扱われます。設定しない場合は「名無しのオホゴエニスト」として表示されます
              </p>
            </div>

            <div className="space-y-2">
              <Label>性別 *</Label>
              <input
                type="hidden"
                {...register('gender', validationRules.gender)}
              />
              <Select
                onValueChange={(value) => {
                  setValue('gender', value)
                  trigger('gender')
                }}
              >
                <SelectTrigger
                  className={
                    errors.gender ? 'border-red-500 focus:border-red-500' : ''
                  }
                >
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deletePassword">削除用パスワード *</Label>
              <div className="relative">
                <Input
                  id="deletePassword"
                  type="password"
                  {...register(
                    'deletePassword',
                    validationRules.deletePassword
                  )}
                  className={`pr-12 ${
                    errors.deletePassword
                      ? 'border-red-500 focus:border-red-500'
                      : ''
                  }`}
                  maxLength={50}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                  {(deletePasswordValue || '').length}/50
                </div>
              </div>
              {errors.deletePassword && (
                <p className="text-sm text-red-600">
                  {errors.deletePassword.message}
                </p>
              )}
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
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="allowPromotion"
                  onCheckedChange={(checked) => {
                    setValue('allowPromotion', checked)
                    trigger('allowPromotion')
                  }}
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
              {errors.allowPromotion && (
                <p className="text-sm text-red-600">
                  {errors.allowPromotion.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-primary-gradient w-full"
          size="lg"
        >
          <p className="text-lg text-white">投稿する</p>
        </Button>
      </div>
    </div>
  )
}

export default AudioCreate
