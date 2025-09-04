declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_OPENWEATHER_API_KEY: string;
      NEXT_PUBLIC_OPENWEATHER_BASE_URL: string;
    }
  }
}

export {};
