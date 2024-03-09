import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  key: string;
  defaultValue?: string;
}

const useParamsState = (props: Props) => {
  const { key, defaultValue = '' } = props;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === '') {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const setQuery = (value: string) => {
    const query = createQueryString(key, value);
    if (query === '') {
      router.push(pathname);
    } else {
      router.push(`${pathname}?${query}`);
    }
  };

  return [searchParams.get(key) ?? defaultValue, setQuery] as const;
};

export default useParamsState;
