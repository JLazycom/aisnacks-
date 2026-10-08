/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_BOT_USERNAME?: string
  readonly VITE_PAYMENTS_API_URL?: string
  readonly VITE_CRYPTO_PAY_LINK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
