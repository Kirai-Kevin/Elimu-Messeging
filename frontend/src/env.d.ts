/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENDBIRD_APP_ID: string
  readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
