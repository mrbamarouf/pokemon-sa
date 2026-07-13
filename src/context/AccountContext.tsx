import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
  cleanCustomerPhone,
  clearLocalCustomerAccount,
  formatRewardLockRemaining,
  readRewardLocks,
  REWARD_LOCK_WINDOW_MS,
  startShopifyCustomerAccountLogin,
  startShopifyCustomerAccountLogout,
  writeRewardLocks,
  type CustomerRewardLock,
  type LocalCustomerAccount,
} from "@/lib/shopify/customer";

type Account = LocalCustomerAccount;
type GameLock = CustomerRewardLock;

type AccountContextValue = {
  account: Account | null;
  isAccountOpen: boolean;
  openAccount: () => void;
  closeAccount: () => void;
  saveAccount: (account: Account) => void;
  logout: () => void;
  canPlayGame: boolean;
  remainingGameLock: string;
  consumeGameChance: (reward?: string) => boolean;
};

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [locks, setLocks] = useState<Record<string, GameLock>>(() => readRewardLocks());
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const phoneKey = account ? cleanCustomerPhone(account.phone) : "";
  const lock = phoneKey ? locks[phoneKey] : undefined;
  const elapsed = lock ? Date.now() - lock.playedAt : REWARD_LOCK_WINDOW_MS + 1;
  const canPlayGame = Boolean(account) && elapsed >= REWARD_LOCK_WINDOW_MS;

  const saveLocks = (next: Record<string, GameLock>) => {
    setLocks(next);
    writeRewardLocks(next);
  };

  const value = useMemo<AccountContextValue>(
    () => ({
      account,
      isAccountOpen,
      openAccount: () => setIsAccountOpen(true),
      closeAccount: () => setIsAccountOpen(false),
      saveAccount: () => {
        startShopifyCustomerAccountLogin();
      },
      logout: () => {
        setAccount(null);
        clearLocalCustomerAccount();
        startShopifyCustomerAccountLogout();
      },
      canPlayGame,
      remainingGameLock: lock && elapsed < REWARD_LOCK_WINDOW_MS ? formatRewardLockRemaining(REWARD_LOCK_WINDOW_MS - elapsed) : "",
      consumeGameChance: (reward) => {
        if (!account || !phoneKey || !canPlayGame) return false;
        saveLocks({ ...locks, [phoneKey]: { playedAt: Date.now(), reward } });
        return true;
      },
    }),
    [account, canPlayGame, elapsed, isAccountOpen, lock, locks, phoneKey],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used within AccountProvider");
  return context;
};
