// パスワード暗号化ユーティリティ（1カラム保存用）
export const hashPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  const saltedPassword = salt + password
  const encoder = new TextEncoder()
  const data = encoder.encode(saltedPassword)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export const generateSalt = (length: number = 16): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// 1カラム用：パスワードを暗号化（ソルト:ハッシュの形式）
export const preparePasswordForStorage = async (password: string): Promise<string> => {
  const salt = generateSalt(16)
  const hash = await hashPassword(password, salt)
  return `${salt}:${hash}`
}