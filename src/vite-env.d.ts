/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly VITE_USE_MOCK_DATA?: string
  readonly VITE_API_URL?: string
  readonly VITE_APP_TITLE?: string
  readonly VITE_ENABLE_PERFORMANCE_MONITORING?: string
  readonly VITE_PERFORMANCE_SAMPLE_RATE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}