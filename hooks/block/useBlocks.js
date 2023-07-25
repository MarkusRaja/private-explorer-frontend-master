import useSWR from 'swr';

import { fetcher } from 'utils';

export const useBlocks = (fields) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/explorer/blocks?fields[blocks]=${fields.join(',')}`,
    fetcher
  );

  return {
    response: data,
    isLoading: !error && !data,
    error
  };
}
