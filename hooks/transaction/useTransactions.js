import useSWR from 'swr';

import { fetcher } from 'utils';

export const useTransactions = (fields) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/explorer/transactions?fields[transactions]=${fields.join(',')}`,
    fetcher
  );

  return {
    response: data,
    isLoading: !error && !data,
    error
  };
}
