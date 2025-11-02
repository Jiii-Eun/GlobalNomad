declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Auth: {
        authorize: (opts: { redirectUri: string; state?: string }) => void;
      };
    };
  }
}

export {};
