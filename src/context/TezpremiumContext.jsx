import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { parseBalanceUzs } from '../utils/balanceUzs';
import { parseJsonMaybeLeadingNoise } from '../utils/parseJsonResponse';

const TezpremiumContext = createContext(null);

const API_BASE =
  import.meta.env.VITE_UZBSTAR_API_BASE ?? 'https://tezpremium.uz/uzbstar';
const DEV_USER_ID = '7521806735';

/** Telegram Mini App: `order_gift.php` va boshqa POST API lar uchun */
export function getTelegramInitData() {
  if (typeof window === 'undefined') return null;
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
    const initData = getTelegramInitData();
    const body = {
      ...(initData ? { initData } : { user_id: DEV_USER_ID }),
      ...params,
    };

    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, */*',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    const parsed = parseJsonMaybeLeadingNoise(text);
    if (!parsed || typeof parsed !== 'object') {
      const snippet = text.slice(0, 160).replace(/\s+/g, ' ').trim();
      throw new Error(
        res.ok
          ? `Javob JSON emas${snippet ? `: ${snippet}` : ''}`
          : `HTTP ${res.status}${snippet ? ` — ${snippet}` : ''}`
      );
    }
    return parsed;
  }, []);

  const fetchUserFromApi = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('get_user.php');
      const rawBal =
        data.data?.balance_uzs ??
        data.data?.balance ??
        data.balance ??
        '0';
      const userData = data.ok
        ? {
            ...data.data,
            balance: String(rawBal),
            balanceUzs: parseBalanceUzs(rawBal),
          }
        : { balance: '0', balanceUzs: 0 };
      setApiUser(userData);
      return userData;
    } catch {
      const fallback = { balance: '0', balanceUzs: 0 };
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

  /** Orqa fonda — historyLoading yo‘q, UI “refresh” bo‘lmaydi */
  const refreshHistorySilent = useCallback(async () => {
    await Promise.all([fetchOrders(), fetchPayments()]);
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
    refreshHistorySilent,
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
