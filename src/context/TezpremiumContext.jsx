import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const TezpremiumContext = createContext(null);

const API_BASE = 'https://tezpremium.uz/uzbstar';
const DEV_USER_ID = '7521806735';

function getInitData() {
  const initData = window.Telegram?.WebApp?.initData;
  return initData && initData.length > 0 ? initData : null;
}

export function TezpremiumProvider({ children }) {
  const [apiUser, setApiUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const fetchedRef = useRef(false);

  const apiFetch = useCallback(async (endpoint, params = {}) => {
    const initData = getInitData();
    const body = {
      ...(initData ? { initData } : { user_id: DEV_USER_ID }),
      ...params,
    };

    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return res.json();
  }, []);

  const fetchUserFromApi = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('get_user.php');
      const userData = data.ok
        ? { balance: data.data?.balance ?? data.balance ?? '0', ...data.data }
        : { balance: '0' };
      setApiUser(userData);
      return userData;
    } catch {
      const fallback = { balance: '0' };
      setApiUser(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await apiFetch('history.php');
      setOrders(data.ok && Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    }
  }, [apiFetch]);

  const fetchPayments = useCallback(async () => {
    try {
      const data = await apiFetch('payments.php');
      setPayments(data.ok && Array.isArray(data.payments) ? data.payments : []);
    } catch {
      setPayments([]);
    }
  }, [apiFetch]);

  const refreshHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      await Promise.all([fetchOrders(), fetchPayments()]);
    } finally {
      setHistoryLoading(false);
    }
  }, [fetchOrders, fetchPayments]);

  const refreshUser = useCallback(async () => {
    await fetchUserFromApi();
    await refreshHistory();
  }, [fetchUserFromApi, refreshHistory]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchUserFromApi();
    refreshHistory();
  }, [fetchUserFromApi, refreshHistory]);

  const value = {
    apiUser,
    orders,
    payments,
    loading,
    historyLoading,
    apiFetch,
    refreshUser,
    refreshHistory,
  };

  return (
    <TezpremiumContext.Provider value={value}>
      {children}
    </TezpremiumContext.Provider>
  );
}

export function useTezpremium() {
  const ctx = useContext(TezpremiumContext);
  if (!ctx) {
    throw new Error('useTezpremium must be used inside TezpremiumProvider');
  }
  return ctx;
}
