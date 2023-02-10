import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  //
  const [value, setValue] = useState<T>(
    // useState 초기값 지정 콜백함수, 최초 랜더링시 한번만 실행
    () => {
      const jsonValue = localStorage.getItem(key);
      if (jsonValue != null) return JSON.parse(jsonValue);

      if (typeof initialValue === 'function') {
        return (initialValue as () => T)();
      } else {
        return initialValue;
      }
    }
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}
