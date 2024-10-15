import { useRouter } from "@src/hooks/useRouter";
import { useState } from "react";

export function useStateParams<T>(initialState: T): [T, (state: T) => void] {
  const router = useRouter();
  const [state, setState] = useState<T>(initialState);

  const onChange = (s: T) => {
    setState(s);
    const objs: any = s;
    router.push({
      query: objs,
    });
  };

  return [state, onChange];
}
