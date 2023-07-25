import useSWR from 'swr';

import { fetcher } from 'utils';

export const useBlockDetails = (blockId) => {
  const { data, error } = useSWR(
    blockId ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/explorer/blocks/${blockId}` : null,
    fetcher
  );

  return {
    response: data,
    isLoading: !error && !data,
    error
  };
}
