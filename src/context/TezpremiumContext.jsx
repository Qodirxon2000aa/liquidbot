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
  const [loading, setLoading] = useState(true);
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

  const refreshUser = useCallback(async () => {
    await fetchUserFromApi();
  }, [fetchUserFromApi]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchUserFromApi();
  }, [fetchUserFromApi]);

  const value = {
    apiUser,
    loading,
    apiFetch,
    refreshUser,
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
