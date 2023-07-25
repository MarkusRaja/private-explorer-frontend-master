import useSWR from 'swr';

import { fetcher } from 'utils';

export const useTransactionDetails = (transactionHash) => {
  const { data, error } = useSWR(
    transactionHash ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/explorer/transactions/${transactionHash}` : null,
    fetcher
  );

  return {
    response: data,
    isLoading: !error && !data,
    error
  };
}
