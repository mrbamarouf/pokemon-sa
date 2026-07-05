import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type Account = {
  name: string;
  phone: string;
  email?: string;
};

type GameLock = {
  playedAt: number;
  reward?: string;
};

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

const ACCOUNT_KEY = "pokemon-sa-account";
const GAME_LOCKS_KEY = "pokemon-sa-game-locks";
const DAY = 24 * 60 * 60 * 1000;

const readAccount = (): Account | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
};

const readLocks = (): Record<string, GameLock> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(GAME_LOCKS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, GameLock>) : {};
  } catch {
    return {};
  }
};

const cleanPhone = (phone: string) => phone.replace(/[^\d+]/g, "");

const formatRemaining = (ms: number) => {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(() => readAccount());
  const [locks, setLocks] = useState<Record<string, GameLock>>(() => readLocks());
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const phoneKey = account ? cleanPhone(account.phone) : "";
  const lock = phoneKey ? locks[phoneKey] : undefined;
  const elapsed = lock ? Date.now() - lock.playedAt : DAY + 1;
  const canPlayGame = Boolean(account) && elapsed >= DAY;

  const saveLocks = (next: Record<string, GameLock>) => {
    setLocks(next);
    window.localStorage.setItem(GAME_LOCKS_KEY, JSON.stringify(next));
  };

  const value = useMemo<AccountContextValue>(
    () => ({
      account,
      isAccountOpen,
      openAccount: () => setIsAccountOpen(true),
      closeAccount: () => setIsAccountOpen(false),
      saveAccount: (nextAccount) => {
        const normalized = { ...nextAccount, phone: cleanPhone(nextAccount.phone) };
        setAccount(normalized);
        window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(normalized));
        setIsAccountOpen(false);
      },
      logout: () => {
        setAccount(null);
        window.localStorage.removeItem(ACCOUNT_KEY);
      },
      canPlayGame,
      remainingGameLock: lock && elapsed < DAY ? formatRemaining(DAY - elapsed) : "",
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
