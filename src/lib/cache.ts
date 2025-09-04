// 날씨 데이터 캐싱 유틸리티

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class WeatherCache {
  private cache = new Map<string, CacheItem<unknown>>();
  private readonly DEFAULT_EXPIRY = 10 * 60 * 1000; // 10분

  set<T>(key: string, data: T, expiry: number = this.DEFAULT_EXPIRY): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + expiry,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // 만료된 데이터 제거
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // 만료된 데이터 제거
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  // 만료된 항목들 정리
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // 캐시 상태 정보
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const item of this.cache.values()) {
      if (now > item.expiry) {
        expiredItems++;
      } else {
        validItems++;
      }
    }

    return {
      total: this.cache.size,
      valid: validItems,
      expired: expiredItems,
    };
  }
}

// 전역 캐시 인스턴스
export const weatherCache = new WeatherCache();

// 캐시 키 생성 함수
export function getCacheKey(type: 'current' | 'forecast', city: string): string {
  return `${type}:${city.toLowerCase()}`;
}

// 주기적으로 만료된 캐시 정리 (5분마다)
if (typeof window !== 'undefined') {
  setInterval(() => {
    weatherCache.cleanup();
  }, 5 * 60 * 1000);
}
