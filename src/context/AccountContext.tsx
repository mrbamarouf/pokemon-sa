import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  cleanCustomerIdentifier,
  clearLegacyLocalCustomerAccount,
  fetchShopifyCustomerSession,
  formatRewardLockRemaining,
  readRewardLocks,
  REWARD_LOCK_WINDOW_MS,
  startShopifyCustomerAccountLogin,
  startShopifyCustomerAccountLogout,
  writeRewardLocks,
  type CustomerRewardLock,
  type ShopifyCustomerAccount,
} from "@/lib/shopify/customer";
import { useLanguage } from "./LanguageContext";

type Account = ShopifyCustomerAccount;
type GameLock = CustomerRewardLock;

type AccountContextValue = {
  account: Account | null;
  isAccountLoading: boolean;
  isAccountOpen: boolean;
  openAccount: () => void;
  closeAccount: () => void;
  saveAccount: (account?: Partial<Account>) => void;
  refreshAccount: () => Promise<void>;
  logout: () => void;
  canPlayGame: boolean;
  remainingGameLock: string;
  consumeGameChance: (reward?: string) => boolean;
};

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useLanguage();
  const [account, setAccount] = useState<Account | null>(null);
  const [isAccountLoading, setIsAccountLoading] = useState(true);
  const [locks, setLocks] = useState<Record<string, GameLock>>(() => readRewardLocks());
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    let active = true;
    clearLegacyLocalCustomerAccount();
    const loadAccount = async () => {
      setIsAccountLoading(true);
      const result = await fetchShopifyCustomerSession();
      if (!active) return;
      setAccount(result.data?.account ?? null);
      setIsAccountLoading(false);
    };
    void loadAccount();
    return () => {
      active = false;
    };
  }, []);

  const refreshAccount = useCallback(async () => {
    setIsAccountLoading(true);
    const result = await fetchShopifyCustomerSession();
    setAccount(result.data?.account ?? null);
    setIsAccountLoading(false);
  }, []);

  const customerKey = account ? cleanCustomerIdentifier(account.id || account.email || account.name) : "";
  const lock = customerKey ? locks[customerKey] : undefined;
  const elapsed = lock ? Date.now() - lock.playedAt : REWARD_LOCK_WINDOW_MS + 1;
  const canPlayGame = Boolean(account) && elapsed >= REWARD_LOCK_WINDOW_MS;

  const saveLocks = (next: Record<string, GameLock>) => {
    setLocks(next);
    writeRewardLocks(next);
  };

  const value = useMemo<AccountContextValue>(
    () => ({
      account,
      isAccountLoading,
      isAccountOpen,
      openAccount: () => setIsAccountOpen(true),
      closeAccount: () => setIsAccountOpen(false),
      saveAccount: () => {
        startShopifyCustomerAccountLogin({ language });
      },
      refreshAccount,
      logout: () => {
        setAccount(null);
        clearLegacyLocalCustomerAccount();
        startShopifyCustomerAccountLogout();
      },
      canPlayGame,
      remainingGameLock: lock && elapsed < REWARD_LOCK_WINDOW_MS ? formatRewardLockRemaining(REWARD_LOCK_WINDOW_MS - elapsed) : "",
      consumeGameChance: (reward) => {
        if (!account || !customerKey || !canPlayGame) return false;
        saveLocks({ ...locks, [customerKey]: { playedAt: Date.now(), reward } });
        return true;
      },
    }),
    [account, canPlayGame, customerKey, elapsed, isAccountLoading, isAccountOpen, language, lock, locks, refreshAccount],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used within AccountProvider");
  return context;
};
