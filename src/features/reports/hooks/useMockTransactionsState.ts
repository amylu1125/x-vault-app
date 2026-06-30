import { useCallback, useState } from 'react';
import { INITIAL_TRANSACTIONS } from '../../../data';
import type { TransactionRecord } from '../../../types';

export function useMockTransactionsState() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);

  return { transactions, setTransactions };
}
