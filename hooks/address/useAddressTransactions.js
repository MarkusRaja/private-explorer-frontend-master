import useSWR from 'swr';

import { fetcher } from 'utils';

export const useAddressTransactions = (address) => {
  const { data, error } = useSWR(
    address ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/explorer/addresses/${address}/transactions` : null,
    fetcher
  );

  return {
    response: data,
    isLoading: !error && !data,
    error
  };
}
