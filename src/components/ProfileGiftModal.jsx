import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronDown, ChevronUp, Gift } from 'lucide-react';
import { BodyPortal } from './BodyPortal';
import { useTelegram } from '../hooks/useTelegram';
import { useTezpremium } from '../context/TezpremiumContext';
import { isGiftOrder } from '../utils/orderType';

function formatUzNumber(n) {
  if (n == null || n === '') return '0';
  const s = String(n).replace(/\D/g, '') || String(n);
  const num = Number(s);
  if (Number.isNaN(num)) return String(n);
  return num.toLocaleString('ru-RU');
}

export function ProfileGiftModal({ open, onClose }) {
  const { t } = useTranslation();
  const { user, webApp } = useTelegram();
  const { apiUser, orders, refreshHistorySilent } = useTezpremium();

  const [expandedRow, setExpandedRow] = useState(null);
  const [listLoading, setListLoading] = useState(false);

  const profilePhotoUrl =
    user?.photo_url || apiUser?.profile || apiUser?.photo_url || null;

  const displayUsername = useMemo(() => {
    const u = user?.username;
    if (!u) return t('history.noUsername');
    const s = String(u).replace(/^@/, '');
    return `@${s}`;
  }, [user?.username, t]);

  const giftOrders = useMemo(
    () => (orders || []).filter(isGiftOrder),
    [orders]
  );

  const ordersList = useMemo(
    () =>
      giftOrders.map((o, index) => ({
        id: `gift-${o.order_id ?? o.id ?? index}`,
        amount: o.amount ?? 0,
        summa:
          o.summa != null && o.summa !== ''
            ? `${formatUzNumber(o.summa)} UZS`
            : null,
        date: o.date || o.created_at || t('history.unknown'),
        sent: o.sent || o.recipient || '—',
        status: (o.status || 'completed').toLowerCase(),
        typeLabel: String(o.type || 'Gift').trim() || 'Gift',
      })),
    [giftOrders, t]
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setListLoading(true);
    refreshHistorySilent().finally(() => {
      if (!cancelled) setListLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, refreshHistorySilent]);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      refreshHistorySilent();
    }, 10000);
    return () => clearInterval(id);
  }, [open, refreshHistorySilent]);

  const handleClose = () => {
    try {
      webApp?.HapticFeedback?.impactOccurred?.('medium');
    } catch {
      /* ignore */
    }
    setExpandedRow(null);
    onClose();
  };

  const toggleRow = (id) => {
    try {
      webApp?.HapticFeedback?.impactOccurred?.('light');
    } catch {
      /* ignore */
    }
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const statusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed' || s === 'paid') return 'bg-emerald-500 text-white';
    if (s === 'pending') return 'bg-amber-500 text-white';
    if (s === 'cancelled' || s === 'failed' || s === 'canceled')
      return 'bg-red-500 text-white';
    return 'bg-zinc-500 text-white';
  };

  if (!open) return null;

  return (
    <BodyPortal>
      <div
        className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-md dark:bg-black/35 p-0 sm:p-4"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="w-full max-w-md max-h-[92dvh] flex flex-col rounded-t-3xl sm:rounded-3xl liquid-modal overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="sticky top-0 z-10 shrink-0 flex items-center justify-between border-b border-white/20 px-4 py-3 backdrop-blur-xl dark:border-white/10"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-blue-500 shrink-0 bg-zinc-200 dark:bg-zinc-700">
                {profilePhotoUrl ? (
                  <img
                    src={profilePhotoUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold text-zinc-600">
                    {(user?.first_name?.[0] || '?').toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                  {user?.first_name} {user?.last_name || ''}
                </p>
                <p className="text-xs text-zinc-500 truncate">{displayUsername}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="liquid-icon-btn !rounded-full"
              aria-label={t('money.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 pt-4 pb-2 shrink-0 flex items-center gap-2">
            <div className="liquid-glass flex h-9 w-9 shrink-0 items-center justify-center rounded-3xl text-rose-500 dark:text-rose-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                {t('history.giftModalTitle')}
              </h2>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                {t('history.giftModalCount', { count: ordersList.length })}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 min-h-0">
            {listLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
                <p className="text-sm text-zinc-500">{t('history.loading')}</p>
              </div>
            ) : ordersList.length === 0 ? (
              <p className="text-center text-sm text-zinc-500 py-12">
                {t('history.emptyGiftOrders')}
              </p>
            ) : (
              <ul className="space-y-2">
                {ordersList.map((item) => {
                  const expanded = expandedRow === item.id;
                  return (
                    <li
                      key={item.id}
                      className="liquid-row overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleRow(item.id)}
                        className="w-full flex items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-white/10"
                      >
                        <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 shrink-0 max-w-[32%] truncate">
                          {t('market.gifts')}
                        </span>
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex-1 min-w-0 truncate">
                          {item.amount} ⭐
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate max-w-[28%]">
                          {item.date}
                        </span>
                        {expanded ? (
                          <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                        )}
                      </button>

                      {expanded && (
                        <div className="px-3 pb-3 pt-0 border-t border-white/10 space-y-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 pt-2">
                            <p>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                {t('history.recipient')}:
                              </span>{' '}
                              {item.sent}
                            </p>
                            {item.summa && (
                              <p>
                                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                  {t('history.orderSum')}:
                                </span>{' '}
                                {item.summa}
                              </p>
                            )}
                            <p>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                {t('history.orderType')}:
                              </span>{' '}
                              {item.typeLabel}
                            </p>
                          </div>
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusClass(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </BodyPortal>
  );
}
